const logic = require('./logic');
const db = require('./db');

// Mock dailyQuestionCache and refreshQuestionCache logic for testing
let dailyQuestionCache = {
    dayIndex: null,
    questions: [],
    correctMap: new Map(),
    explanationMap: new Map()
};

async function refreshQuestionCache(dayIndex) {
    if (dailyQuestionCache.dayIndex === dayIndex) {
        console.log("CACHE HIT: Using cached questions.");
        return false; // No refresh needed
    }

    console.log(`CACHE MISS: Refreshing cache for day ${dayIndex}...`);
    // In actual server, this queries DB. Here we just mock the structure.
    const ids = logic.getQuestionIds(dayIndex);

    // Simulate DB results
    const mockQuestions = ids.map(id => ({
        id,
        question_text: `Test Question ${id}`,
        option_a: 'A', option_b: 'B', option_c: 'C', option_d: 'D'
    }));

    dailyQuestionCache = {
        dayIndex,
        questions: mockQuestions,
        correctMap: new Map(),
        explanationMap: new Map()
    };
    return true; // Refreshed
}

async function runTest() {
    console.log("=== Testing Backend Cache Logic ===");

    const day = logic.getDayIndex();

    console.log("\nStep 1: First access (should be cache miss)");
    const refreshed1 = await refreshQuestionCache(day);
    if (refreshed1 && dailyQuestionCache.dayIndex === day) {
        console.log("✅ Success: Cache populated.");
    } else {
        console.log("❌ Failure: Cache not populated.");
    }

    console.log("\nStep 2: Second access (should be cache hit)");
    const refreshed2 = await refreshQuestionCache(day);
    if (!refreshed2) {
        console.log("✅ Success: Cache HIT confirmed.");
    } else {
        console.log("❌ Failure: Cache should have been hit.");
    }

    console.log("\nStep 3: Accessing next day (should be cache miss)");
    const nextDay = day + 1;
    const refreshed3 = await refreshQuestionCache(nextDay);
    if (refreshed3 && dailyQuestionCache.dayIndex === nextDay) {
        console.log("✅ Success: Cache refreshed for new day.");
    } else {
        console.log("❌ Failure: Cache should have refreshed for new day.");
    }
}

runTest().catch(console.error);
