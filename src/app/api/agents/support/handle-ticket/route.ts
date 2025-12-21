import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { adminDb } from "@/lib/firebase/admin";

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

const SupportSchema = z.object({
    category: z.enum(["technical", "billing", "account", "feature_request", "other"]),
    response: z.string(),
    sentiment: z.enum(["positive", "neutral", "negative"]),
    resolved: z.boolean(),
    escalationRequired: z.boolean(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { ticket, customer } = body;

        if (!ticket) {
            return NextResponse.json({ error: "Missing ticket data" }, { status: 400 });
        }

        const prompt = `
      You are an expert Customer Success Agent for "Antigravity".
      
      Customer Ticket: "${ticket}"
      Customer Context: ${JSON.stringify(customer || {})}
      
      Task:
      1. Categorize the ticket.
      2. Analyze the sentiment.
      3. Draft a helpful, empathetic, and professional response. 
      4. Determine if this can be effectively resolved by AI (resolved=true) or needs human escalation (escalationRequired=true).
      
      Guidelines:
      - Be polite and concise.
      - If it's a simple query, solve it.
      - If it requires sensitive actions (refunds, deletions), flag for escalation.
    `;

        const { object } = await generateObject({
            model: google("gemini-1.5-pro-latest"),
            schema: SupportSchema,
            prompt: prompt,
        });

        // Log action
        await adminDb.collection("agent_logs").add({
            agentId: "cs-agent-001",
            action: "HANDLE_TICKET",
            input: { ticket, customer },
            output: object,
            timestamp: new Date().toISOString(),
        });

        return NextResponse.json(object);
    } catch (error: any) {
        console.error("CS Agent Error:", error);
        return NextResponse.json(
            { error: "Support request failed", details: error.message },
            { status: 500 }
        );
    }
}
