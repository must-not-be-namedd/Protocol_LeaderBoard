const { Pool } = require('./Website/backend/node_modules/pg');

const pool = new Pool({
    connectionString: "postgresql://postgres.drbevbbswbntqoysyyfj:Board2020bmsce@aws-1-ap-south-1.pooler.supabase.com:6543/postgres",
    ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
    process.stdout.write("Checking Database Schema...\n");
    try {
        process.stdout.write("\n--- Table: questions ---\n");
        const questionsCols = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'questions'
        `);
        console.table(questionsCols.rows);

        process.stdout.write("\n--- Table: daily_submissions ---\n");
        const submissionsCols = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'daily_submissions'
        `);
        console.table(submissionsCols.rows);

    } catch (err) {
        process.stdout.write("Error: " + err.message + "\n");
    } finally {
        await pool.end();
    }
}

checkSchema();
