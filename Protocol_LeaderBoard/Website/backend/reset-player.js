require('dotenv').config();
const { Pool } = require('pg');
const logic = require('./logic');

const args = process.argv.slice(2);
const username = args[0];

if (!username) {
    console.error("❌ Usage: node reset-player.js <username>");
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

(async () => {
    try {
        const dayIndex = logic.getDayIndex();
        console.log(`Resetting attempt for user: '${username}' on Day Index: ${dayIndex}`);

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Delete Attempts
            const res1 = await client.query('DELETE FROM daily_attempts WHERE username = $1 AND day_index = $2', [username, dayIndex]);

            // 2. Delete Submissions
            const res2 = await client.query('DELETE FROM daily_submissions WHERE username = $1 AND day_index = $2', [username, dayIndex]);

            // 3. Delete Score
            const res3 = await client.query('DELETE FROM daily_scores WHERE username = $1 AND day_index = $2', [username, dayIndex]);

            await client.query('COMMIT');

            if (res1.rowCount > 0 || res2.rowCount > 0 || res3.rowCount > 0) {
                console.log("✅ User reset successfully!");
                console.log(`   - Removed lock from 'daily_attempts'`);
                console.log(`   - deleted ${res2.rowCount} answers`);
                console.log(`   - deleted score entry`);
                console.log("\n👉 You can now clear LocalStorage and play again!");
            } else {
                console.log("⚠️ No records found for this user today. Are you sure they played?");
            }

        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
        process.exit(0);

    } catch (err) {
        console.error("❌ Reset failed:", err);
        process.exit(1);
    }
})();
