const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');
const logic = require('./logic');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for now, or strict validation can be added later
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// === UTILS ===

async function getDailyLeaderboard(dayIndex) {
    const result = await db.query(
        `SELECT username, score FROM daily_scores 
     WHERE day_index = $1 
     ORDER BY score DESC, username ASC`,
        [dayIndex]
    );
    return result.rows;
}

// === API ENDPOINTS ===

// 1. GET STATUS
app.get('/api/daily-status', async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ error: 'Username required' });
        }

        const dayIndex = logic.getDayIndex();

        // Check if user played
        const attempt = await db.query(
            'SELECT 1 FROM daily_attempts WHERE username = $1 AND day_index = $2',
            [username, dayIndex]
        );

        res.json({
            dayIndex,
            played: attempt.rowCount > 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 2. GET QUESTIONS
app.get('/api/questions', async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({ error: 'Username required' });
        }

        const dayIndex = logic.getDayIndex();

        // Verify not played
        const attempt = await db.query(
            'SELECT 1 FROM daily_attempts WHERE username = $1 AND day_index = $2',
            [username, dayIndex]
        );

        if (attempt.rowCount > 0) {
            return res.status(403).json({ error: 'You have already played today' });
        }

        // Get Question IDs
        const ids = logic.getQuestionIds(dayIndex);

        // Fetch from DB
        // Postgres ANY takes an array
        const questionsRes = await db.query(
            `SELECT id, question_text, option_a, option_b, option_c, option_d 
       FROM questions 
       WHERE id = ANY($1::int[])`,
            [ids]
        );

        // Ensure we return them in the deterministic order (logic.js order)
        // Map IDs to the found question objects
        const questionMap = new Map();
        questionsRes.rows.forEach(q => questionMap.set(q.id, q));

        const orderedQuestions = ids.map(id => questionMap.get(id)).filter(q => q); // filter undefined if DB missing data

        res.json({
            dayIndex,
            questions: orderedQuestions
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 3. SUBMIT ANSWERS
app.post('/api/submit', async (req, res) => {
    const { username, answers } = req.body;
    if (!username || !answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Invalid payload' });
    }

    const client = await db.pool.connect();

    try {
        const dayIndex = logic.getDayIndex();

        await client.query('BEGIN');

        // 1. Attempt to lock/reserve entry for this user + day
        // We insert into daily_attempts first. If it fails due to Unique Constraint, user already played.
        try {
            await client.query(
                'INSERT INTO daily_attempts (username, day_index) VALUES ($1, $2)',
                [username, dayIndex]
            );
        } catch (err) {
            if (err.code === '23505') { // unique_violation
                await client.query('ROLLBACK');
                return res.status(403).json({ error: 'You have already played today' });
            }
            throw err;
        }

        // 2. Fetch Correct Answers
        // We use logic.getQuestionIds to know WHICH questions "should" be there
        // But we trust the user provided answers for specific IDs.
        // Wait, verification: what if user answers question ID 999?
        // We should only grade the questions that are valid for TODAY.
        const validIds = logic.getQuestionIds(dayIndex);
        const validIdSet = new Set(validIds);

        // Fetch correct options from DB for these IDs
        const questionsRes = await client.query(
            'SELECT id, correct_option FROM questions WHERE id = ANY($1::int[])',
            [validIds]
        );

        const correctMap = new Map();
        questionsRes.rows.forEach(q => correctMap.set(q.id, q.correct_option));

        // 3. Grade
        let score = 0;
        const submissionPromises = [];

        for (const ans of answers) {
            const qId = ans.questionId || ans.question_id;
            const selected = ans.selected || ans.selected_option;

            // Ignore invalid questions for this day
            if (!validIdSet.has(qId)) continue;

            const correctOpt = correctMap.get(qId);
            const isCorrect = (selected === correctOpt);

            if (isCorrect) score++;

            // Prepare insert
            submissionPromises.push(
                client.query(
                    `INSERT INTO daily_submissions (username, question_id, day_index, selected_option, is_correct)
           VALUES ($1, $2, $3, $4, $5)`,
                    [username, qId, dayIndex, selected, isCorrect]
                )
            );
        }

        await Promise.all(submissionPromises);

        // 4. Record Score
        await client.query(
            'INSERT INTO daily_scores (username, score, day_index) VALUES ($1, $2, $3)',
            [username, score, dayIndex]
        );

        await client.query('COMMIT');

        // 5. Emit Real-Time Update
        const freshLeaderboard = await getDailyLeaderboard(dayIndex);
        io.emit('leaderboard_update', freshLeaderboard);

        // 6. Return Result
        // Return correct answers so frontend can show them
        const correctAnswers = {};
        for (const [id, opt] of correctMap.entries()) {
            correctAnswers[id] = opt;
        }

        res.json({
            success: true,
            score,
            correctAnswers,
            leaderboard: freshLeaderboard
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Submission error:', err);
        res.status(500).json({ error: 'Submission failed' });
    } finally {
        client.release();
    }
});

// 4. LEADERBOARD
app.get('/api/leaderboard', async (req, res) => {
    try {
        const dayIndex = logic.getDayIndex();
        const leaderboard = await getDailyLeaderboard(dayIndex);
        res.json({ dayIndex, leaderboard });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// === ADMIN ENDPOINTS (Hidden, protected by ADMIN_SECRET) ===
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'secure_secret_here';

function verifyAdmin(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

// Admin: Reset a user's attempt for specific day (Emergency fix)
// CURL: curl -X POST http://localhost:3010/api/admin/reset-user -H "Authorization: Bearer <SECRET>" -H "Content-Type: application/json" -d '{"username":"foo","dayIndex":5}'
app.post('/api/admin/reset-user', verifyAdmin, async (req, res) => {
    const { username, dayIndex } = req.body;
    if (!username || !dayIndex) return res.status(400).json({ error: 'Missing params' });

    try {
        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');
            await client.query('DELETE FROM daily_attempts WHERE username = $1 AND day_index = $2', [username, dayIndex]);
            await client.query('DELETE FROM daily_submissions WHERE username = $1 AND day_index = $2', [username, dayIndex]);
            await client.query('DELETE FROM daily_scores WHERE username = $1 AND day_index = $2', [username, dayIndex]);
            await client.query('COMMIT');
            res.json({ success: true, message: `Reset complete for ${username} on day ${dayIndex}` });
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// === SOCKET.IO ===
io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = 3010;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
