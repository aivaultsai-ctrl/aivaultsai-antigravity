async function testWorkflow() {
    console.log("🚀 Starting Orchestration Test...");

    try {
        const response = await fetch('http://localhost:3000/api/orchestration/run-workflow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                workflow: "full-company-loop",
                params: {
                    videoUrl: "https://youtube.com/watch?v=demo",
                    customerId: "client_99"
                }
            })
        });

        const data = await response.json();
        console.log("\n✅ STATUS:", response.status);
        console.log("📦 RESULTAAT:\n");
        console.dir(data, { depth: null, colors: true });

    } catch (error) {
        console.error("\n❌ ERROR:", error.message);
        console.log("Check of je server wel draait op localhost:3000!");
    }
}

testWorkflow();