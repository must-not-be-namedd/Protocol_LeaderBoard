require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

(async () => {
    console.log("Testing connection to:", process.env.DATABASE_URL ? "URL Found" : "URL Missing");
    try {
        const res = await pool.query("SELECT 1");
        console.log("✅ Database connected:", res.rows);
        process.exit(0);
    } catch (err) {
        console.error("❌ Database error:", err);
        process.exit(1);
    }
})();
