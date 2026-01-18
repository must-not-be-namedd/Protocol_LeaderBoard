const { Pool } = require('pg');
require('dotenv').config();

// SSL logic for Supabase (production) vs local
const isProduction = process.env.NODE_ENV === 'production';

// Connection configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool: pool
};
