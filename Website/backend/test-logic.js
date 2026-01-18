const logic = require('./logic');

console.log("=== Testing Deterministic Logic ===");

const dayIndex = logic.getDayIndex();
console.log(`Current Day Index: ${dayIndex}`);

const ids = logic.getQuestionIds(dayIndex);
console.log(`Question IDs for Day ${dayIndex}:`, ids);

console.log("\n--- Future Check ---");
const nextDay = dayIndex + 1;
const nextIds = logic.getQuestionIds(nextDay);
console.log(`Question IDs for Day ${nextDay}:`, nextIds);

// Verification
const launchDate = new Date('2026-01-01T00:00:00Z');
console.log(`\nLaunch Date used: ${launchDate.toISOString()}`);
const now = new Date();
console.log(`Current Time: ${now.toISOString()}`);

if (ids.length !== 10) console.error("FAIL: Should return 10 questions");
else console.log("PASS: Returns 10 questions");

if (nextIds[0] !== ids[ids.length - 1] + 1 && nextIds[0] !== 1) { // 1 if wrapped
    console.log("INFO: IDs seem sequential (ignoring wrap for now)");
}
