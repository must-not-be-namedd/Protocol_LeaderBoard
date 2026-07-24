const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

(async () => {
    try {
        console.log("Connecting to:", process.env.DATABASE_URL ? "Supabase Pooler" : "MISSING URL");
        const res = await pool.query("SELECT COUNT(*) FROM questions");
        console.log("Total questions in DB:", res.rows[0].count);

        const minMaxRes = await pool.query("SELECT MIN(id), MAX(id) FROM questions");
        console.log("ID range:", minMaxRes.rows[0]);

        const firstFew = await pool.query("SELECT id FROM questions ORDER BY id LIMIT 5");
        console.log("First 5 IDs:", firstFew.rows.map(r => r.id));

        const lastFew = await pool.query("SELECT id FROM questions ORDER BY id DESC LIMIT 5");
        console.log("Last 5 IDs:", lastFew.rows.map(r => r.id));

        process.exit(0);
    } catch (err) {
        console.error("❌ Error:", err);
        process.exit(1);
    }
})();
