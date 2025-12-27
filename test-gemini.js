const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '.env.local');
        if (fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            content.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^"(.*)"$/, '$1');
                    process.env[key] = value;
                }
            });
        }
    } catch (e) {
        console.error("Failed to load .env.local", e);
    }
}

async function test() {
    loadEnv();
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API KEY provided: " + apiKey); // Careful not to log the key if it was partially there
        return;
    }

    console.log("Initializing Gemini with key length:", apiKey.length);
    const genAI = new GoogleGenerativeAI(apiKey);

    // Try without 'models/' first as per user suggestion
    console.log("Testing model: gemini-1.5-pro");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    try {
        const result = await model.generateContent("Hello, are you working?");
        console.log("Success:", result.response.text());
    } catch (e) {
        console.error("Error:", e.message);

        // If it fails, maybe try flash
        console.log("Testing model: gemini-1.5-flash");
        try {
            const model2 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result2 = await model2.generateContent("Hello?");
            console.log("Success with flash:", result2.response.text());
        } catch (e2) {
            console.error("Error with flash:", e2.message);
        }
    }
}

test();
