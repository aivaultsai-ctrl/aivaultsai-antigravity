import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    // Simulatie: SDR Agent
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({
        agentId: "sdr-agent-001",
        status: "qualified",
        score: 92,
        reasoning: "Perfect fit voor Enterprise Plan",
        outreachDraft: "Hoi [Naam], ik zag dat jullie groeien..."
    });
}
