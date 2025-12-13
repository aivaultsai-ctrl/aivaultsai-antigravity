import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, convertToCoreMessages } from "ai";
import { tools } from "@/lib/ai";
import { adminDb } from "@/lib/firebase/admin";
import { DEFAULT_EMPLOYEES } from "@/lib/ai/prompts";

// Ensure Node.js runtime for Firebase Admin SDK compatibility
export const runtime = 'nodejs';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { messages, employeeId } = await req.json();

        // 1. Fetch Employee Context
        // For Phase 3, we look up in defaults if string matches, else check DB
        let systemPrompt = DEFAULT_EMPLOYEES[0].systemPrompt;
        let allowedTools = DEFAULT_EMPLOYEES[0].tools;

        if (employeeId) {
            // Check defaults first (optimization)
            const defaultEmp = DEFAULT_EMPLOYEES.find(e => e.name === employeeId || e.role === employeeId);
            if (defaultEmp) {
                systemPrompt = defaultEmp.systemPrompt;
                allowedTools = defaultEmp.tools;
            } else {
                // Check Firestore
                const doc = await adminDb.collection("ai_employees").doc(employeeId).get();
                if (doc.exists) {
                    const data = doc.data();
                    systemPrompt = data?.systemPrompt || systemPrompt;
                    allowedTools = data?.tools || allowedTools;
                }
            }
        }

        // 2. Filter Tools
        const activeTools = Object.fromEntries(
            Object.entries(tools).filter(([key]) => allowedTools.includes(key))
        );

        // 3. Stream Response
        const result = await streamText({
            model: google("gemini-1.5-pro-latest"),
            system: systemPrompt,
            messages: convertToCoreMessages(messages),
            tools: activeTools,
            maxSteps: 5,
            onFinish: async ({ text, toolCalls, toolResults, usage }) => {
                // Asynchronously logging usage or conversation turns can happen here
                // firestore.collection('conversations').add(...)
            }
        });

        return result.toDataStreamResponse();

    } catch (error) {
        console.error("AI Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
