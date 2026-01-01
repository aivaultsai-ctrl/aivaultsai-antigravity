import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { adminDb } from "../../../../lib/firebase/admin";
import { DEFAULT_EMPLOYEES } from "../../../../lib/ai/employee-prompts";

export const runtime = 'nodejs';
export const maxDuration = 60; // Increased to 60s for better resilience

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("CRITICAL: GOOGLE_GEMINI_API_KEY is missing");
    throw new Error("Missing GOOGLE_GEMINI_API_KEY");
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, employeeId } = body;

        // 1. Fetch Employee Context with Timeout
        let systemPrompt = DEFAULT_EMPLOYEES[0].systemPrompt;

        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: "Invalid message format" }), { status: 400 });
        }

        if (employeeId) {
            const defaultEmp = DEFAULT_EMPLOYEES.find(e => e.name === employeeId || e.role === employeeId);
            if (defaultEmp) {
                systemPrompt = defaultEmp.systemPrompt;
            } else {
                try {
                    const doc = await adminDb.collection("ai_employees").doc(employeeId).get();
                    if (doc.exists) {
                        const data = doc.data();
                        systemPrompt = data?.systemPrompt || systemPrompt;
                    }
                } catch (e) {
                    console.warn("DB Lookup failed used default");
                }
            }
        }

        const coreMessages = messages.map((m: any) => ({
            role: m.role,
            content: m.content
        }));

        const result = await streamText({
            model: google('gemini-1.5-flash'),
            messages: coreMessages,
            system: systemPrompt,
        });

        return result.toTextStreamResponse();

    } catch (error: any) {
        console.error("AI Route Critical Failure:", error);
        return new Response(JSON.stringify({ error: "Internal System Error", details: error.message }), { status: 500 });
    }
}
