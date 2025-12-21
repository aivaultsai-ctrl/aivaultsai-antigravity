import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { adminDb } from "@/lib/firebase/admin";

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

const ResultSchema = z.object({
    score: z.number().min(0).max(100),
    qualification: z.string(),
    reasoning: z.string(),
    nextSteps: z.array(z.string()),
    personalizedMessage: z.string(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { leadData } = body;

        if (!leadData) {
            return NextResponse.json(
                { error: "Missing leadData" },
                { status: 400 }
            );
        }

        const prompt = `
      You are an expert Sales Development Representative (SDR) Agent.
      Analyze the following lead and qualify them for our AI automation agency "Antigravity".
      
      Lead Data:
      Name: ${leadData.name}
      Company: ${leadData.company}
      Role: ${leadData.role}
      LinkedIn: ${leadData.linkedinUrl || "N/A"}
      Website: ${leadData.website || "N/A"}
      
      Our Ideal Customer Profile (ICP):
      - Growing agencies or small-to-medium businesses.
      - Roles: Founders, CEOs, Marketing Directors, Operations Heads.
      - Industry: Marketing, Tech, E-commerce, Real Estate.
      
      Task:
      1. Score the lead (0-100) based on fit.
      2. Provide a qualification status (e.g., High Priority, Low Priority).
      3. Explain your reasoning.
      4. Suggest 3 concrete next steps.
      5. Draft a personalized outreach message (email or LinkedIn DM) that is casual but professional, referencing their specific details if possible.
    `;

        const { object } = await generateObject({
            model: google("gemini-1.5-pro-latest"),
            schema: ResultSchema,
            prompt: prompt,
        });

        // Log to Firestore
        await adminDb.collection("agent_logs").add({
            agentId: "sdr-agent-001",
            action: "QUALIFY_LEAD",
            input: leadData,
            output: object,
            timestamp: new Date().toISOString(),
        });

        return NextResponse.json(object);
    } catch (error: any) {
        console.error("SDR Agent Error:", error);
        return NextResponse.json(
            { error: "Failed to qualify lead", details: error.message },
            { status: 500 }
        );
    }
}
