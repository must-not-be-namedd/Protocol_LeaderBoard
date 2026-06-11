Protocol CSE Department Club Website

Welcome to the official repository for Protocol, the premier Computer Science and Engineering department club at BMS College of Engineering!

This repository contains the full-stack source code for the club's website, featuring a dynamic UI, a client-side article rendering system, and a custom-built, real-time Daily Challenge quiz engine.

Features

Custom UI/UX: A fully responsive, dark-themed design accented with Protocol's signature pastel pinks and maroons.\
Synergy Weekly: A client-side CMS that dynamically loads weekly tech articles and featured posts.\
Interactive Hub: Direct portals to custom club experiences like The Protocol Gauntlet and Project Blackscreen.\
The Daily Challenge: A robust, custom-built daily quiz system featuring deterministic daily question rotation (everyone gets the same 10 questions each day), strict 1-play-per-day enforcement, and a real-time live leaderboard powered by WebSockets.\
Tech Stack

Frontend\
HTML5 & CSS3: Vanilla setup with heavily customized CSS variables and grid layouts.\
JavaScript: Vanilla JS for DOM manipulation, countdown timers, and dynamic article rendering.\
Libraries: Bootstrap 5 (grid & utilities), Bootstrap Icons, Google Fonts (Antonio, Josefin Sans, Delicious Handrawn).\

Backend (Daily Challenge)\
Runtime: Node.js\
Framework: Express.js\
Database: PostgreSQL (Optimized for Supabase) plus pg node-postgres.\
Real-time: Socket.io (for live leaderboard updates).\

Project Structure

Protocol_Website/
Website/
index.html (Landing page)\
synergy.html (Synergy Weekly article hub)\
styles.css (Global stylesheet)\
script.js (Global utilities and countdown logic)\
synergy.js (Client-side article database and renderer)\
(other HTML files: about, core, events, hackathon, notes, etc.)\
backend/\
server.js (Main API & Socket.io server)\
db.js (PostgreSQL connection pool setup)\
logic.js (Deterministic quiz question engine)\
schema.sql (Database table structures)\
package.json (Backend dependencies)\

Getting Started (Local Development)

To run this project locally, you need to set up both the Database/Backend and the Frontend.

Prerequisites\
Node.js installed on your machine.\
PostgreSQL installed locally, OR a free cloud database account like Supabase.\

1. Database Setup
Create a new PostgreSQL database (e.g., protocol_db).
Open Website/backend/schema.sql and run the SQL commands in your database to create the required tables: questions, daily_attempts, daily_submissions, daily_scores.
Note: You will need to manually insert some questions into the questions table for the Daily Challenge to work.
2. Backend Setup
Open your terminal and navigate to the backend directory using: cd Website/backend
Install the Node dependencies using: npm install
Create a .env file in the backend folder and configure your environment variables:
PORT=3010
DATABASE_URL=postgres://username:password@localhost:5432/protocol_db
ADMIN_SECRET=your_super_secret_key
(Note: Daily Challenges section will not work on your local system)
Start the server using: npm start
You should see: Server running on port 3010.
4. Frontend Setup
Open Website/script.js and ensure the BACKEND_URL is pointing to your local server for development: const BACKEND_URL = 'http://localhost:3010';
Serve the Website folder using a local web server (Do not just double-click index.html as CORS policies will block API requests).
Using VS Code: Install the Live Server extension, right-click index.html, and select Open with Live Server.
Using Python: Run python -m http.server 8000 inside the Website folder.
Using Node: Run npx serve inside the Website folder.
Open your browser to the local port (e.g., http://localhost:8000).

How the Code Works (For First-Timers)

The Synergy Weekly CMS (synergy.js)
We don't use a heavy database for articles. Instead, synergy.js contains an array of JavaScript objects. To add a new article to the website, simply add a new object to the top of the articles array in synergy.js with the title, image path, description, and url. The script automatically sets the 20th newest article (or the oldest available) as the Featured hero article and builds the grid for the rest.

The Daily Challenge Engine (logic.js)
The quiz system is completely deterministic. It relies on a LAUNCH_DATE (Jan 1, 2025).

1. The server calculates exactly how many days have passed since launch.
2. It uses a seeded random number generator (Fisher-Yates shuffle) to pick 10 question IDs from a pool of 181.
3. Because it's mathematically seeded based on the dayIndex, every user gets the exact same 10 questions on any given day without needing cron jobs to update the database.

Contributing

1. Fork the repository.
2. Create a new branch (feature/AmazingFeature).
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.

Please ensure your code follows the existing CSS variable conventions and responsive grid structures.
