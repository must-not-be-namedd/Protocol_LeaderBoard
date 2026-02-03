require('dotenv').config({ path: './Website/backend/.env' });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
    console.log("Checking Database Schema...");
    try {
        console.log("\n--- Table: questions ---");
        const questionsCols = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'questions'
        `);
        console.table(questionsCols.rows);

        console.log("\n--- Table: daily_submissions ---");
        const submissionsCols = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'daily_submissions'
        `);
        console.table(submissionsCols.rows);

        console.log("\n--- Table: daily_attempts ---");
        const attemptsCols = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'daily_attempts'
        `);
        console.table(attemptsCols.rows);

        console.log("\n--- Table: daily_scores ---");
        const scoresCols = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'daily_scores'
        `);
        console.table(scoresCols.rows);

    } catch (err) {
        console.error("Error checking schema:", err);
    } finally {
        await pool.end();
    }
}

checkSchema();
