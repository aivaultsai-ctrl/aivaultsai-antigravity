import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';
import { adminDb } from "@/lib/firebase/admin";
import { DEFAULT_EMPLOYEES } from "@/lib/ai/employee-prompts";

export const runtime = 'nodejs';
export const maxDuration = 60; // Increased to 60s for better resilience

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("CRITICAL: GOOGLE_GEMINI_API_KEY is missing");
    throw new Error("Missing GOOGLE_GEMINI_API_KEY");
}

const genAI = new GoogleGenerativeAI(apiKey);

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


        // const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        // Fallback to gemini-pro if 1.5-flash is unavailable in the region/version
        // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Convert messages to Gemini format
        // Gemini expects history + last message structure or full chat history
        // SDK `startChat` takes history (previous messages)
        const history = messages.slice(0, -1).map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        // Use system prompt? Gemini 1.5 supports systemInstruction
        const chat = model.startChat({
            history: history,
            systemInstruction: { role: 'user', parts: [{ text: systemPrompt }] }
        });


        const lastMessage = messages[messages.length - 1].content;
        const result = await chat.sendMessageStream(lastMessage);

        // GoogleGenerativeAIStream expects the response object structure to have a stream property, 
        // OR the stream itself depending on version. 
        // result.stream is the AsyncGenerator.
        const stream = GoogleGenerativeAIStream(result);

        return new StreamingTextResponse(stream);

    } catch (error: any) {
        console.error("AI Route Critical Failure:", error);
        return new Response(JSON.stringify({ error: "Internal System Error", details: error.message }), { status: 500 });
    }
}
