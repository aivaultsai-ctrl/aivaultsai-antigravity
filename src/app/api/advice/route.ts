import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { saveAdviceLead } from "@/lib/firebase-admin";

export async function POST(req: Request) {
    try {
        const { business, problem, goal, email } = await req.json();

        if (!business || !problem || !goal) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("API Key not configured");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
You are a senior AI business consultant.
Business: ${business}
Problem: ${problem}
Goal: ${goal}

Give clear, concrete advice in bullet points.
`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // 3. Save Lead / Intelligence to Firestore
        const contextSummary = `Business: ${business} | Problem: ${problem} | Goal: ${goal}`;

        try {
            await saveAdviceLead({
                businessDescription: contextSummary,
                advice: text,
                email: email || ""
            });
        } catch (dbError) {
            console.error("Failed to save lead to firestore (non-fatal):", dbError);
        }

        return NextResponse.json({ advice: text });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
    }
}
