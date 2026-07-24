require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

(async () => {
    try {
        console.log("Reading schema.sql...");
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log("Executing Schema...");
        await pool.query(schemaSql);

        console.log("✅ Schema applied successfully.");

        // Check if questions exist, if not, add seeds
        const checkQ = await pool.query("SELECT COUNT(*) FROM questions");
        const count = parseInt(checkQ.rows[0].count);
        console.log(`Questions found: ${count}`);

        if (count === 0) {
            console.log("Seeding sample questions...");
            // Seed 20 questions so it works out of the box
            const values = [];
            for (let i = 1; i <= 20; i++) {
                values.push(`('Sample Question ${i}: What is ${i}+${i}?', '${i + i}', '${i * i}', '${i + 10}', '${i - 1}', 'A')`);
            }
            const insertQuery = `INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_option) VALUES ${values.join(',')}`;
            await pool.query(insertQuery);
            console.log("✅ Seeded 20 sample questions.");
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ Setup failed:", err);
        process.exit(1);
    }
})();
