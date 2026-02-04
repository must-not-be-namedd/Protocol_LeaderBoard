const { Pool } = require('./Website/backend/node_modules/pg');

const pool = new Pool({
    connectionString: "postgresql://postgres.drbevbbswbntqoysyyfj:Board2020bmsce@aws-1-ap-south-1.pooler.supabase.com:6543/postgres",
    ssl: { rejectUnauthorized: false }
});

async function checkDetails() {
    process.stdout.write("Checking Database Detailed Schema...\n");
    try {
        const tables = ['questions', 'daily_attempts', 'daily_submissions', 'daily_scores'];

        for (const table of tables) {
            process.stdout.write(`\n--- Table: ${table} ---\n`);
            const cols = await pool.query(`
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = '${table}'
                ORDER BY ordinal_position
            `);
            console.table(cols.rows);

            process.stdout.write(`\n--- Constraints for: ${table} ---\n`);
            const constraints = await pool.query(`
                SELECT
                    tc.constraint_name, 
                    tc.constraint_type,
                    kcu.column_name
                FROM 
                    information_schema.table_constraints AS tc 
                    JOIN information_schema.key_column_usage AS kcu
                      ON tc.constraint_name = kcu.constraint_name
                      AND tc.table_schema = kcu.table_schema
                WHERE tc.table_name = '${table}'
            `);
            console.table(constraints.rows);
        }

    } catch (err) {
        process.stdout.write("Error: " + err.message + "\n");
    } finally {
        await pool.end();
    }
}

checkDetails();
