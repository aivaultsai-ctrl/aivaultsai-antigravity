import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    // Simulatie: Content Agent
    await new Promise(resolve => setTimeout(resolve, 2500)); // Fake processing time

    return NextResponse.json({
        agentId: "content-agent-001",
        status: "success",
        output: {
            posts: [
                { platform: "LinkedIn", content: "AI verandert alles. Hier zijn 3 redenen..." },
                { platform: "Twitter", content: "Stop met handmatig werk. AI Agents zijn hier. 🚀" }
            ],
            viralityScore: 85
        }
    });
}
