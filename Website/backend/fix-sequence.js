const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

(async () => {
    try {
        console.log("Fixing sequence for 'questions' table...");
        const res = await pool.query("SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions))");
        console.log("Sequence reset to:", res.rows[0].setval);
        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
})();
