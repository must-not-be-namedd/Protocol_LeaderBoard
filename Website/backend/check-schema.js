const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

(async () => {
    try {
        const res = await pool.query(`
            SELECT conname, contype, pg_get_constraintdef(c.oid) as def
            FROM pg_constraint c
            JOIN pg_namespace n ON n.oid = c.connamespace
            WHERE n.nspname = 'public'
        `);
        console.log("Constraints in database:");
        res.rows.forEach(row => console.log(`- ${row.conname} (${row.contype}): ${row.def}`));
        process.exit(0);
    } catch (err) {
        console.error("Error checking schema:", err);
        process.exit(1);
    }
})();
