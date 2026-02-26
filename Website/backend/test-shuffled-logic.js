const logic = require('./logic');

function testRotation() {
    console.log("--- Daily Challenge Logic Verification ---\n");

    const QUESTIONS_PER_CYCLE = 180;
    const DAYS_PER_CYCLE = 18;

    // Test Cycle 1 (Days 1 to 18)
    console.log("Cycle 1 (Days 1-18):");
    const cycle1Ids = new Set();
    for (let day = 1; day <= DAYS_PER_CYCLE; day++) {
        const ids = logic.getQuestionIds(day);
        console.log(`Day ${day}: [${ids.join(', ')}]`);
        ids.forEach(id => {
            if (cycle1Ids.has(id)) {
                console.error(`❌ Duplicate ID ${id} found in Day ${day}`);
            }
            cycle1Ids.add(id);
        });
    }
    console.log(`\nCycle 1 unique IDs: ${cycle1Ids.size} / ${QUESTIONS_PER_CYCLE}`);

    // Test Cycle 2 (Days 19 to 36)
    console.log("\nCycle 2 (Days 19-36):");
    const cycle2Ids = new Set();
    const day19Ids = logic.getQuestionIds(19); // Start of Cycle 2
    const day1Ids = logic.getQuestionIds(1);

    console.log(`Day 1:  [${day1Ids.join(', ')}]`);
    console.log(`Day 19: [${day19Ids.join(', ')}]`);

    let overlap = day1Ids.filter(id => day19Ids.includes(id));
    if (overlap.length === 10 && day1Ids[0] === day19Ids[0]) {
        console.error("❌ Cycle 2 Day 1 is identical to Cycle 1 Day 1 (Sequential rotation detected!)");
    } else {
        console.log("✅ Cycle 2 order is different or shuffled relative to Cycle 1.");
    }

    // Verify all 180 are present in cycle 2
    for (let day = 19; day <= 36; day++) {
        const ids = logic.getQuestionIds(day);
        ids.forEach(id => cycle2Ids.add(id));
    }
    console.log(`Cycle 2 unique IDs: ${cycle2Ids.size} / ${QUESTIONS_PER_CYCLE}`);

    if (cycle1Ids.size === QUESTIONS_PER_CYCLE && cycle2Ids.size === QUESTIONS_PER_CYCLE) {
        console.log("\n✅ VERIFICATION PASSED: All questions are used once per cycle, and the order shuffles between cycles.");
    } else {
        console.log("\n❌ VERIFICATION FAILED: Missing questions in cycle.");
    }
}

testRotation();
