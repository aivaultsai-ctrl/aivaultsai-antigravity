import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

interface AgentMetric {
    [key: string]: number;
}

interface Agent {
    id: string;
    name: string;
    role: string;
    status: string;
    capabilities: string[];
    description: string;
    pricing: number;
    metrics: AgentMetric;
}

const AGENTS: Agent[] = [
    {
        id: "sdr-agent-001",
        name: "Sales Development Agent",
        role: "SDR",
        status: "active",
        capabilities: [
            "Lead qualification",
            "Cold outreach",
            "Email sequences",
            "LinkedIn automation",
            "Meeting scheduling",
        ],
        description:
            "Qualificeert leads, stuurt gepersonaliseerde outreach, en boekt meetings",
        pricing: 1500,
        metrics: {
            leadsProcessed: 0,
            meetingsBooked: 0,
            responseRate: 0,
        },
    },
    {
        id: "content-agent-001",
        name: "Content Marketing Agent",
        role: "Content Creator",
        status: "active",
        capabilities: [
            "Video to posts conversion",
            "Multi-platform adaptation",
            "SEO optimization",
            "Content calendaring",
            "Trend analysis",
        ],
        description: "Transformeert 1 video naar 50+ social posts voor alle platforms",
        pricing: 1200,
        metrics: {
            postsGenerated: 0,
            platformsCovered: 0,
            engagementRate: 0,
        },
    },
    {
        id: "cs-agent-001",
        name: "Customer Success Agent",
        role: "Support",
        status: "active",
        capabilities: [
            "24/7 customer support",
            "Ticket resolution",
            "Onboarding automation",
            "Churn prevention",
            "Upsell opportunities",
        ],
        description:
            "Beantwoordt vragen, lost problemen op, en verbetert customer satisfaction",
        pricing: 1000,
        metrics: {
            ticketsResolved: 0,
            avgResponseTime: 0,
            satisfactionScore: 0,
        },
    },
    {
        id: "ops-agent-001",
        name: "Operations Agent",
        role: "Operations",
        status: "active",
        capabilities: [
            "Task automation",
            "Workflow optimization",
            "Data processing",
            "Report generation",
            "System monitoring",
        ],
        description: "Automatiseert repetitieve taken en optimaliseert workflows",
        pricing: 800,
        metrics: {
            tasksAutomated: 0,
            timesSaved: 0,
            errorsReduced: 0,
        },
    },
    {
        id: "growth-agent-001",
        name: "Growth Strategy Agent",
        role: "Strategy",
        status: "active",
        capabilities: [
            "Market analysis",
            "Competitor research",
            "Growth hacking",
            "A/B test planning",
            "ROI optimization",
        ],
        description:
            "Analyseert data, identificeert kansen, en stelt growth strategieën voor",
        pricing: 2000,
        metrics: {
            insightsGenerated: 0,
            opportunitiesFound: 0,
            roiImprovement: 0,
        },
    },
];

export async function GET() {
    try {
        const results = [];
        let addedCount = 0;

        for (const agent of AGENTS) {
            const agentRef = adminDb.collection("ai_employees").doc(agent.id);
            const doc = await agentRef.get();

            if (!doc.exists) {
                await agentRef.set({
                    ...agent,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                });
                results.push({ id: agent.id, status: "added" });
                addedCount++;
                console.log(`[SEED] Added agent: ${agent.id}`);
            } else {
                results.push({ id: agent.id, status: "skipped (already exists)" });
                console.log(`[SEED] Skipped agent: ${agent.id}`);
            }
        }

        // Log action
        await adminDb.collection("system_logs").add({
            action: "SEED_AGENTS",
            status: "success",
            details: { addedCount, totalAgents: AGENTS.length },
            timestamp: new Date().toISOString(),
        });

        return NextResponse.json(
            {
                message: `Seeding complete. Added ${addedCount} new agents.`,
                results,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json(
            { error: "Failed to seed database", details: error.message },
            { status: 500 }
        );
    }
}
