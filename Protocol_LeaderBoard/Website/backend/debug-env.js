require('dotenv').config();
console.log("Checking Environment Variables...");
console.log("DATABASE_URL type:", typeof process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
    console.log("DATABASE_URL length:", process.env.DATABASE_URL.length);
    console.log("Starts with:", process.env.DATABASE_URL.substring(0, 5));
} else {
    console.log("DATABASE_URL is MISSING or Empty");
}
