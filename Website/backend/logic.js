// Deterministic Question Engine

// FIXED LAUNCH DATE (CRITICAL FOR DETERMINISM)
// Using Jan 1, 2026 as the epoch start based on metadata current year
const LAUNCH_DATE = new Date('2025-01-01T00:00:00Z');
const TOTAL_QUESTIONS = 55;
const QUESTIONS_PER_DAY = 10;

/**
 * Calculates the current Day Index based on system time and Launch Date.
 * Day Index 1 = First day of launch.
 * @returns {number} The current day index (integer >= 1)
 */
function getDayIndex() {
    const now = new Date();
    const diffTime = now.getTime() - LAUNCH_DATE.getTime();

    // Convert milliseconds to days
    // 1000 ms * 60 s * 60 m * 24 h
    const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Day Index starts at 1
    const dayIndex = daysPassed + 1;

    return dayIndex > 0 ? dayIndex : 1; // Safety fallback
}

/**
 * Returns the 10 Question IDs for a specific day index.
 * Formula: start_question_id = ((DAY_INDEX - 1) * QUESTIONS_PER_DAY % TOTAL_QUESTIONS) + 1
 * @param {number} dayIndex 
 * @returns {number[]} Array of 10 question IDs
 */
function getQuestionIds(dayIndex) {
    // 1-based index calculation
    // (Day 1 - 1) * 10 % 500 + 1 = 1  -> Questions 1-10
    // (Day 2 - 1) * 10 % 500 + 1 = 11 -> Questions 11-20

    const startId = ((dayIndex - 1) * QUESTIONS_PER_DAY % TOTAL_QUESTIONS) + 1;

    const ids = [];
    for (let i = 0; i < QUESTIONS_PER_DAY; i++) {
        // Assuming questions are strictly 1 to 500
        ids.push(startId + i);
    }
    return ids;
}

module.exports = { getDayIndex, getQuestionIds };
