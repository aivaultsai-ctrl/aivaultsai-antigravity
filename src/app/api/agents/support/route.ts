import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { ticket, customerId } = body;

        // SIMULATION LOGIC
        await new Promise(resolve => setTimeout(resolve, 1500));

        const response = {
            agentId: "cs-agent-001",
            status: "resolved",
            sentiment: "neutral",
            category: ticket.toLowerCase().includes("refund") ? "billing" : "technical",
            reply: `Beste klant, ik zie dat u vraagt over: "${ticket}". Ik heb dit direct voor u gecontroleerd. Omdat u een gewaardeerde klant bent (ID: ${customerId}), heb ik dit prioriteit gegeven via ticket #99281.`,
            actionTaken: "Escalated to Tier 2",
            satisfactionPrediction: 95
        };

        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: 'Agent crashed' }, { status: 500 });
    }
}
