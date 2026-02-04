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

// Log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// === CACHE ===
let dailyQuestionCache = {
    dayIndex: null,
    questions: [],
    correctMap: new Map(),
    explanationMap: new Map()
};

async function refreshQuestionCache(dayIndex) {
    if (dailyQuestionCache.dayIndex === dayIndex) return;

    try {
        console.log(`Refreshing cache for day ${dayIndex}...`);
        const ids = logic.getQuestionIds(dayIndex);
        const questionsRes = await db.query(
            `SELECT id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation 
             FROM questions 
             WHERE id = ANY($1::int[])`,
            [ids]
        );

        const questionMap = new Map();
        const correctMap = new Map();
        const explanationMap = new Map();

        questionsRes.rows.forEach(q => {
            questionMap.set(q.id, {
                id: q.id,
                question_text: q.question_text,
                option_a: q.option_a,
                option_b: q.option_b,
                option_c: q.option_c,
                option_d: q.option_d
            });
            correctMap.set(q.id, q.correct_option);
            explanationMap.set(q.id, q.explanation);
        });

        const orderedQuestions = ids.map(id => questionMap.get(id)).filter(q => q);

        dailyQuestionCache = {
            dayIndex,
            questions: orderedQuestions,
            correctMap,
            explanationMap
        };

    } catch (err) {
        console.error('Error in refreshQuestionCache:', err);
        throw err; // Propagate to route handler
    }
}

// === UTILS ===

async function getDailyLeaderboard(dayIndex) {
    const result = await db.query(
        `SELECT username, score FROM daily_scores 
     WHERE day_index = $1 
     ORDER BY score DESC, username ASC
     LIMIT 20`,
        [dayIndex]
    );
    return result.rows;
}

// 0. HEALTH CHECK (WAKE UP CALL)
app.get('/api/health', async (req, res) => {
    try {
        // Minimal DB query to wake up both Render and Supabase
        await db.query('SELECT 1');
        res.json({ status: 'ok', warmed: true });
    } catch (err) {
        console.error('Health check failed:', err);
        res.status(500).json({ status: 'error' });
    }
});

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

        // Refresh cache if needed
        await refreshQuestionCache(dayIndex);

        res.json({
            dayIndex,
            questions: dailyQuestionCache.questions
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

    const dayIndex = logic.getDayIndex();

    try {
        // 1. Refresh cache OUTSIDE transaction to avoid holding connection
        await refreshQuestionCache(dayIndex);

        const client = await db.pool.connect();
        try {
            await client.query('BEGIN');

            // 2. Attempt to lock/reserve entry for this user + day
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

            const validIds = logic.getQuestionIds(dayIndex);
            const validIdSet = new Set(validIds);
            const correctMap = dailyQuestionCache.correctMap;
            const explanationMap = dailyQuestionCache.explanationMap;

            // 3. Grade & Insert Submissions (SEQUENTIALLY to avoid client error)
            let score = 0;
            for (const ans of answers) {
                const qId = ans.questionId || ans.question_id;
                const selected = ans.selected || ans.selected_option;

                if (!validIdSet.has(qId)) continue;

                const correctOpt = correctMap.get(qId);
                const isCorrect = (selected === correctOpt);
                if (isCorrect) score++;

                await client.query(
                    `INSERT INTO daily_submissions (username, question_id, day_index, selected_option, is_correct, email)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [username, qId, dayIndex, selected, isCorrect, '']
                );
            }

            // 4. Record Score
            try {
                await client.query(
                    'INSERT INTO daily_scores (username, score, day_index, email) VALUES ($1, $2, $3, $4)',
                    [username, score, dayIndex, '']
                );
            } catch (err) {
                if (err.code === '23505') {
                    await client.query('ROLLBACK');
                    return res.status(403).json({ error: 'You have already played today' });
                }
                throw err;
            }

            await client.query('COMMIT');

            // 5. Emit Real-Time Update
            const freshLeaderboard = await getDailyLeaderboard(dayIndex);
            io.emit('leaderboard_update', freshLeaderboard);

            // 6. Return Result
            const correctAnswers = {};
            const explanations = {};
            for (const [id, opt] of correctMap.entries()) {
                correctAnswers[id] = opt;
                explanations[id] = explanationMap.get(id);
            }

            res.json({
                success: true,
                score,
                correctAnswers,
                explanations,
                leaderboard: freshLeaderboard
            });

        } catch (err) {
            await client.query('ROLLBACK').catch(e => console.error('Rollback error:', e));
            console.error('Submission transaction error:', err);
            res.status(500).json({ error: 'Submission failed: ' + err.message });
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Submission cache/connection error:', err);
        res.status(500).json({ error: 'Server initialization error' });
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

const PORT = process.env.PORT || 3010;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
