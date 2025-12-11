import fetch from "node-fetch";

const API_URL = "http://localhost:3000";

// Test cases
const tests = [
    {
        name: "Health Check",
        method: "GET",
        endpoint: "/",
        expected: "status: ok"
    },
    {
        name: "Toxic Comment",
        method: "POST",
        endpoint: "/detect-toxic",
        body: { text: "You are stupid and I hate you" },
        expected: "high toxic score"
    },
    {
        name: "Non-Toxic Comment",
        method: "POST",
        endpoint: "/detect-toxic",
        body: { text: "Have a great day!" },
        expected: "low toxic scores"
    },
    {
        name: "Empty Text Error",
        method: "POST",
        endpoint: "/detect-toxic",
        body: { text: "" },
        expected: "400 error"
    },
    {
        name: "Missing Text Error",
        method: "POST",
        endpoint: "/detect-toxic",
        body: {},
        expected: "400 error"
    }
];

async function runTest(test) {
    console.log(`\n🧪 Testing: ${test.name}`);
    console.log(`   Expected: ${test.expected}`);

    try {
        const options = {
            method: test.method,
            headers: { "Content-Type": "application/json" }
        };

        if (test.body) {
            options.body = JSON.stringify(test.body);
        }

        const response = await fetch(`${API_URL}${test.endpoint}`, options);
        const data = await response.json();

        console.log(`   Status: ${response.status}`);
        console.log(`   Response:`, JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log(`   ✅ PASS`);
        } else {
            console.log(`   ⚠️  Expected error received`);
        }
    } catch (error) {
        console.log(`   ❌ FAIL: ${error.message}`);
    }
}

async function runAllTests() {
    console.log("🚀 Starting API Tests...\n");
    console.log("=".repeat(50));

    for (const test of tests) {
        await runTest(test);
    }

    console.log("\n" + "=".repeat(50));
    console.log("\n✅ All tests completed!");
}

// Run tests
runAllTests().catch(console.error);
