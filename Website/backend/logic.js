// Deterministic Question Engine

// FIXED LAUNCH DATE (CRITICAL FOR DETERMINISM)
// Using Jan 1, 2026 as the epoch start based on metadata current year
const LAUNCH_DATE = new Date('2025-01-01T00:00:00Z');
const TOTAL_QUESTIONS = 181;
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
 * Simple seeded random number generator for deterministic behavior.
 */
function seededRandom(seed) {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

/**
 * Returns the 10 Question IDs for a specific day index.
 * Ensures all questions are used in a ~18-day cycle, but in a shuffled order
 * that changes every cycle.
 * @param {number} dayIndex 
 * @returns {number[]} Array of 10 question IDs
 */
function getQuestionIds(dayIndex) {
    const cycleLength = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_DAY); // 19 days
    const rotationCycle = Math.floor((dayIndex - 1) / cycleLength);
    const dayInCycle = (dayIndex - 1) % cycleLength;

    // Create a pool of all question IDs [60, 240] based on actual DB min/max
    const pool = Array.from({ length: TOTAL_QUESTIONS }, (_, i) => i + 60);

    // Deterministically shuffle the pool based on the rotation cycle
    // We use a simple Fisher-Yates shuffle with a seeded random
    let seed = 12345 + rotationCycle * 6789; // Unique seed per cycle
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(seed++) * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // Pick 10 questions for the specific day in the cycle
    const start = dayInCycle * QUESTIONS_PER_DAY;
    return pool.slice(start, start + QUESTIONS_PER_DAY);
}

module.exports = { getDayIndex, getQuestionIds };
