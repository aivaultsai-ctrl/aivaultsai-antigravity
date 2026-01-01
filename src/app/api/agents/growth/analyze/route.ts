import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { adminDb } from "../../../../../lib/firebase/admin";

export const runtime = 'nodejs';

const GrowthSchema = z.object({
    marketAnalysis: z.string(),
    insights: z.array(z.string()),
    opportunities: z.array(
        z.object({
            title: z.string(),
            potentialImpact: z.string(),
            difficulty: z.enum(["Easy", "Medium", "Hard"]),
        })
    ),
    recommendations: z.array(z.string()),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { metrics, competitors, marketContext } = body;

        const prompt = `
      You are a strategic Growth Agent.
      
      metrics: ${JSON.stringify(metrics || {})}
      competitors: ${JSON.stringify(competitors || [])}
      context: ${marketContext || "General SaaS Market"}
      
      Task:
      - Analyze the provided metrics and competitor data.
      - Identify 3 high-impact growth opportunities (Growth Hacks, SEO gaps, Pricing strategies).
      - Provide a brief market analysis.
      - Give actionable recommendations to improve ROI.
    `;

        // Use any cast to bypass AI SDK v6 type mismatch in build
        const { object }: any = await (generateObject as any)({
            model: google("gemini-1.5-pro-latest"),
            schema: GrowthSchema,
            prompt: prompt,
        });

        // Log action
        await adminDb.collection("agent_logs").add({
            agentId: "growth-agent-001",
            action: "ANALYZE_GROWTH",
            input: { metrics, competitors },
            output: object,
            timestamp: new Date().toISOString(),
        });

        return NextResponse.json(object);
    } catch (error: any) {
        console.error("Growth Agent Error:", error);
        return NextResponse.json(
            { error: "Growth analysis failed", details: error.message },
            { status: 500 }
        );
    }
}
