import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, convertToCoreMessages, Message } from "ai";
import { tools } from "@/lib/ai";
import { adminDb } from "@/lib/firebase/admin";
import { DEFAULT_EMPLOYEES } from "@/lib/ai/employee-prompts";

export const runtime = 'nodejs';
export const maxDuration = 60; // Increased to 60s for better resilience

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

const google = createGoogleGenerativeAI({
    apiKey: apiKey || "",
});

export async function POST(req: Request) {
    if (!apiKey) {
        console.error("CRITICAL: GOOGLE_GEMINI_API_KEY is missing");
        return new Response(JSON.stringify({ error: "Service Configuration Error" }), { status: 503 });
    }

    try {
        const body = await req.json();
        const { messages, employeeId } = body;

        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: "Invalid message format" }), { status: 400 });
        }

        // 1. Fetch Employee Context with Timeout
        let systemPrompt = DEFAULT_EMPLOYEES[0].systemPrompt;
        let allowedTools = DEFAULT_EMPLOYEES[0].tools;

        if (employeeId) {
            const defaultEmp = DEFAULT_EMPLOYEES.find(e => e.name === employeeId || e.role === employeeId);
            if (defaultEmp) {
                systemPrompt = defaultEmp.systemPrompt;
                allowedTools = defaultEmp.tools;
            } else {
                // Wrap DB call in a timeout promise
                const dbTimeout = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("DB_TIMEOUT")), 3000)
                );

                try {
                    const docFn = async () => await adminDb.collection("ai_employees").doc(employeeId).get();
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const doc: any = await Promise.race([docFn(), dbTimeout]);

                    if (doc.exists) {
                        const data = doc.data();
                        systemPrompt = data?.systemPrompt || systemPrompt;
                        allowedTools = data?.tools || allowedTools;
                    }
                } catch (dbErr) {
                    console.warn(`[Chat] DB Lookup failed or timed out for ${employeeId}, using defaults.`, dbErr);
                    // Fallback to default is already set
                }
            }
        }

        // 2. Filter Tools
        const activeTools = Object.fromEntries(
            Object.entries(tools).filter(([key]) => allowedTools.includes(key))
        );

        // 3. Stream Response with error handling
        try {
            const result = await streamText({
                model: google("gemini-1.5-pro"),
                system: systemPrompt,
                messages: convertToCoreMessages(messages as Message[]),
                tools: activeTools,
                maxSteps: 5, // Allow multi-step reasoning
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onFinish: async ({ text, toolCalls, toolResults, usage, finishReason }) => {
                    // Fire-and-forget logging
                    if (finishReason !== 'error') {
                        try {
                            // Minimal logging to avoid overhead
                            // await adminDb.collection('logs').add({ ... }) 
                        } catch (e) { /* ignore log errors */ }
                    }
                },
            });

            return result.toDataStreamResponse();
        } catch (streamError: any) {
            console.error("Stream generation failed:", streamError);
            // Check for specific Google API errors (429, 500)
            const status = streamError?.status || 500;
            const message = streamError?.message || "Generation failed";
            return new Response(JSON.stringify({ error: message }), { status });
        }

    } catch (error: any) {
        console.error("AI Route Critical Failure:", error);
        return new Response(JSON.stringify({ error: "Internal System Error" }), { status: 500 });
    }
}
