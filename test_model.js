import fetch from "node-fetch";

console.log("🧪 Toxic Detection Model - Quick Test\n");
console.log("=".repeat(60));

const tests = [
    {
        name: "✅ Safe Comment",
        text: "Have a great day!",
        expectToxic: false
    },
    {
        name: "⚠️  Toxic Comment",
        text: "You are stupid and I hate you",
        expectToxic: true
    },
    {
        name: "⚠️  Threat",
        text: "I will kill you",
        expectToxic: true
    },
    {
        name: "✅ Neutral Comment",
        text: "The weather is nice today",
        expectToxic: false
    }
];

async function testModel() {
    let passed = 0;
    let failed = 0;

    // Check if server is running
    try {
        await fetch("http://localhost:5000/");
    } catch (error) {
        console.log("\n❌ ERROR: Python server not running!");
        console.log("   Start it with: python detoxify_server.py\n");
        return;
    }

    for (const test of tests) {
        console.log(`\n${test.name}`);
        console.log(`Input: "${test.text}"`);

        try {
            const response = await fetch("http://localhost:5000/detect-toxic", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: test.text })
            });

            const result = await response.json();

            // Display scores
            console.log(`Scores:`);
            console.log(`  Toxic: ${(result.toxic * 100).toFixed(1)}%`);
            console.log(`  Severe: ${(result.severe_toxic * 100).toFixed(1)}%`);
            console.log(`  Insult: ${(result.insult * 100).toFixed(1)}%`);
            console.log(`  Threat: ${(result.threat * 100).toFixed(1)}%`);

            // Validate
            const isToxic = result.toxic > 0.5;
            const correct = isToxic === test.expectToxic;

            if (correct) {
                console.log("✅ PASS - Model correctly identified this text");
                passed++;
            } else {
                console.log("❌ FAIL - Model misclassified this text");
                failed++;
            }

        } catch (error) {
            console.log(`❌ ERROR: ${error.message}`);
            failed++;
        }
    }

    console.log("\n" + "=".repeat(60));
    console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

    if (failed === 0) {
        console.log("🎉 All tests passed! Model is working perfectly!\n");
    } else {
        console.log("⚠️  Some tests failed. Check the model setup.\n");
    }
}

testModel();
