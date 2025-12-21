import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { adminDb } from "@/lib/firebase/admin";

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

const OpsSchema = z.object({
    reportSummary: z.string(),
    insights: z.array(z.string()),
    actionsTaken: z.array(z.string()),
    nextScheduledRun: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { task, data } = body;

        if (!task) {
            return NextResponse.json({ error: "Missing task description" }, { status: 400 });
        }

        const prompt = `
      You are an efficient Operations Coordinator Agent.
      
      Task: "${task}"
      Data Context: ${JSON.stringify(data || {})}
      
      Role:
      - Automate repetitive tasks.
      - Process data and generate reports.
      - Optimize workflows.
      
      Instructions:
      1. Execute the requested task logic conceptually (simulate the processing).
      2. Generate a concise report summary.
      3. Extract key insights from the data.
      4. List specific actions you have taken (simulated).
    `;

        const { object } = await generateObject({
            model: google("gemini-1.5-pro-latest"),
            schema: OpsSchema,
            prompt: prompt,
        });

        // Log action
        await adminDb.collection("agent_logs").add({
            agentId: "ops-agent-001",
            action: "AUTOMATE_TASK",
            input: { task, data },
            output: object,
            timestamp: new Date().toISOString(),
        });

        return NextResponse.json(object);
    } catch (error: any) {
        console.error("Ops Agent Error:", error);
        return NextResponse.json(
            { error: "Ops task failed", details: error.message },
            { status: 500 }
        );
    }
}
