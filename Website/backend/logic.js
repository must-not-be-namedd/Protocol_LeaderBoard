// Deterministic Question Engine

// FIXED LAUNCH DATE (CRITICAL FOR DETERMINISM)
// Using Jan 1, 2026 as the epoch start based on metadata current year
const LAUNCH_DATE = new Date('2025-01-01T00:00:00Z');
const TOTAL_QUESTIONS = 210;
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
    const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Day Index starts at 1
    const dayIndex = daysPassed + 1;

    return dayIndex > 0 ? dayIndex : 1;
}

/**
 * Returns the 10 Question IDs for a specific day index.
 * Formula ensures continuous rotation through the pool and wraps per-question.
 * @param {number} dayIndex 
 * @returns {number[]} Array of 10 question IDs
 */
function getQuestionIds(dayIndex) {
    const ids = [];
    for (let i = 0; i < QUESTIONS_PER_DAY; i++) {
        // (DayIndex - 1) * 10 gives the sequence start
        // Adding 'i' moves through the day's set
        // % TOTAL_QUESTIONS + 1 ensures it stays in [1, TOTAL_QUESTIONS] range
        const qId = (((dayIndex - 1) * QUESTIONS_PER_DAY + i) % TOTAL_QUESTIONS) + 1;
        ids.push(qId);
    }
    return ids;
}

module.exports = { getDayIndex, getQuestionIds };
