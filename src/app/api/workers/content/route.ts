import { NextResponse } from "next/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export const runtime = 'edge';

/**
 * CONTENT WORKER: Transforms long-form video content into social variants.
 * Blueprint 2: Content Recycling
 */
export async function POST(req: Request) {
    try {
        const { youtubeUrl, transcript, targetTone = "professional yet viral" } = await req.json();

        if (!youtubeUrl && !transcript) {
            return NextResponse.json({ error: "Missing YouTube URL or transcript" }, { status: 400 });
        }

        const prompt = `
            You are an expert Content Strategist for AIVaultsAI.
            Your task is to transform the following video transcript/context into high-performing social media content.
            
            VIDEO SOURCE: ${youtubeUrl || "Manual Input"}
            TRANSCRIPT: ${transcript || "Extracting from URL not fully implemented - using manual context."}
            TARGET TONE: ${targetTone}

            Please output EXACTLY in JSON format with the following keys:
            1. "tiktokHooks": 5 attention-grabbing hooks for short-form video.
            2. "tweetThread": A 5-tweet thread summarizing the key value points.
            3. "linkedinPost": A professional post optimized for the LinkedIn algorithm.
            4. "newsletterBlurb": A 2-sentence summary for a mailing list.

            Ensure the content emphasizes the core value proposition: "Hire an AI Content Team for 1/10th the cost of a human intern."
        `;

        const { text } = await generateText({
            model: google("models/gemini-1.5-pro-latest"),
            prompt: prompt,
        });

        // Attempt to parse JSON from the AI response
        let structuredContent;
        try {
            // Clean up potential markdown code blocks
            const jsonString = text.replace(/```json|```/g, "").trim();
            structuredContent = JSON.parse(jsonString);
        } catch (e) {
            console.warn("AI didn't return perfect JSON, returning raw text as fallback.");
            structuredContent = { raw: text };
        }

        return NextResponse.json({
            success: true,
            data: structuredContent
        });

    } catch (error: any) {
        console.error("[CONTENT_WORKER_ERROR]:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
