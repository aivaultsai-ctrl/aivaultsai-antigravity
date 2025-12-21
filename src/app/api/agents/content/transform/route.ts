import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import { YoutubeTranscript } from "youtube-transcript";
import fs from "fs";
import path from "path";
import { adminDb } from "@/lib/firebase/admin";

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

const ContentSchema = z.object({
    tiktokHooks: z.array(z.string()),
    linkedinPosts: z.array(
        z.object({
            hook: z.string(),
            body: z.string(),
            cta: z.string(),
        })
    ),
    instagramCaptions: z.array(z.string()),
    metadata: z.object({
        totalVariants: z.number(),
        processingTime: z.string(),
    }),
});

export async function POST(req: Request) {
    const startTime = Date.now();
    try {
        const body = await req.json();
        const { sourceUrl, platforms, tone } = body;

        if (!sourceUrl) {
            return NextResponse.json(
                { error: "Missing sourceUrl" },
                { status: 400 }
            );
        }

        // 1. Fetch Transcript
        let transcriptText = "";
        try {
            const transcriptItems = await YoutubeTranscript.fetchTranscript(sourceUrl);
            transcriptText = transcriptItems.map((t) => t.text).join(" ");
            // Limit transcript length to avoid context limits if necessary, though Gemini 1.5 has large context
            if (transcriptText.length > 50000) {
                transcriptText = transcriptText.substring(0, 50000) + "...[truncated]";
            }
        } catch (e: any) {
            console.error("Transcript fetch failed:", e);
            return NextResponse.json(
                { error: "Failed to fetch YouTube transcript. Ensure video is public and has captions.", details: e.message },
                { status: 400 }
            );
        }

        // 2. Generate Content
        const prompt = `
      You are an expert Content Marketing Agent.
      Source Content (Transcript): "${transcriptText}"
      
      Target Platforms: ${platforms ? platforms.join(", ") : "All"}
      Tone: ${tone || "Professional"}
      
      Task:
      1. Generate 5 highly engaging TikTok/Reels hooks based on the content.
      2. Write LinkedIn posts using the 'Hook-Body-CTA' framework.
      3. Create Instagram captions with appropriate hashtags.
      
      Make the content viral-worthy but consistent with the requested tone.
    `;

        const { object } = await generateObject({
            model: google("gemini-1.5-pro-latest"),
            schema: ContentSchema,
            prompt: prompt,
        });

        // Update metadata regarding processing time
        const duration = ((Date.now() - startTime) / 1000).toFixed(1) + "s";
        object.metadata.processingTime = duration;

        // 3. Save to Filesystem
        const dateStr = new Date().toISOString().split("T")[0];
        const outputDir = path.join(process.cwd(), "agency", "output", "content", dateStr);

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const fileName = `content-${Date.now()}.json`;
        const filePath = path.join(outputDir, fileName);

        fs.writeFileSync(filePath, JSON.stringify(object, null, 2));

        // 4. Log to Firestore
        await adminDb.collection("agent_logs").add({
            agentId: "content-agent-001",
            action: "TRANSFORM_CONTENT",
            input: { sourceUrl, platforms, tone },
            output: object,
            fileLocation: filePath,
            timestamp: new Date().toISOString(),
        });

        return NextResponse.json({
            success: true,
            data: object,
            savedToFile: filePath
        });

    } catch (error: any) {
        console.error("Content Agent Error:", error);
        return NextResponse.json(
            { error: "Content generation failed", details: error.message },
            { status: 500 }
        );
    }
}
