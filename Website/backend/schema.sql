-- Database Schema for Daily Quiz System

-- 1. Questions Table
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D'))
);

-- 2. Daily Attempts (Enforcement Table)
-- Prevents multiple plays per username per day
CREATE TABLE IF NOT EXISTS daily_attempts (
  username TEXT NOT NULL,
  day_index INTEGER NOT NULL,
  PRIMARY KEY (username, day_index)
);

-- 3. Daily Submissions (Individual Answers)
CREATE TABLE IF NOT EXISTS daily_submissions (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  question_id INTEGER NOT NULL,
  day_index INTEGER NOT NULL,
  selected_option CHAR(1) NOT NULL,
  is_correct BOOLEAN NOT NULL
);

-- 4. Daily Scores (Leaderboard)
CREATE TABLE IF NOT EXISTS daily_scores (
  username TEXT NOT NULL,
  score INTEGER NOT NULL,
  day_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster leaderboard queries
CREATE INDEX IF NOT EXISTS idx_daily_scores_day ON daily_scores(day_index);
