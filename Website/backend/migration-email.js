const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

(async () => {
    try {
        console.log("Starting migration...");

        // 1. Update daily_attempts
        console.log("Updating daily_attempts...");
        await pool.query("ALTER TABLE daily_attempts ADD COLUMN IF NOT EXISTS email TEXT");
        // Update PK: Must drop old first
        await pool.query("ALTER TABLE daily_attempts DROP CONSTRAINT IF EXISTS daily_attempts_pkey");
        // We need to handle existing rows if any - set email to username or something
        await pool.query("UPDATE daily_attempts SET email = username WHERE email IS NULL");
        await pool.query("ALTER TABLE daily_attempts ALTER COLUMN email SET NOT NULL");
        await pool.query("ALTER TABLE daily_attempts ADD PRIMARY KEY (email, day_index)");

        // 2. Update daily_submissions
        console.log("Updating daily_submissions...");
        await pool.query("ALTER TABLE daily_submissions ADD COLUMN IF NOT EXISTS email TEXT");
        await pool.query("UPDATE daily_submissions SET email = username WHERE email IS NULL");
        await pool.query("ALTER TABLE daily_submissions ALTER COLUMN email SET NOT NULL");

        // 3. Update daily_scores
        console.log("Updating daily_scores...");
        await pool.query("ALTER TABLE daily_scores ADD COLUMN IF NOT EXISTS email TEXT");
        await pool.query("UPDATE daily_scores SET email = username WHERE email IS NULL");
        await pool.query("ALTER TABLE daily_scores ALTER COLUMN email SET NOT NULL");

        console.log("✅ Migration completed successfully.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration failed:", err);
        process.exit(1);
    }
})();
