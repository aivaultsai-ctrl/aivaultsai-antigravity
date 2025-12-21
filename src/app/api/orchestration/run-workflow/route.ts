import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { headers } from "next/headers";

// Helper to call internal agents
async function callAgent(endpoint: string, data: any, baseUrl: string) {
    const url = `${baseUrl}/api/agents/${endpoint}`;
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`Agent ${endpoint} failed: ${res.statusText}`);
        return await res.json();
    } catch (error: any) {
        throw new Error(`Failed to call ${endpoint}: ${error.message}`);
    }
}

export async function POST(req: Request) {
    const startTime = Date.now();
    try {
        const body = await req.json();
        const { workflow, params } = body;

        // Determine Base URL for internal calls
        const host = headers().get("host");
        const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
        const baseUrl = `${protocol}://${host}`;

        const steps = [];
        let logData = {};
        const workflowId = `wf_${Date.now()}`;

        if (workflow === "content-to-leads") {
            // --- STEP 1: Content Agent ---
            const contentStart = Date.now();
            const contentRes = await callAgent("content/transform", {
                sourceUrl: params.videoUrl,
                platforms: params.targetPlatforms,
                tone: "professional"
            }, baseUrl);

            steps.push({
                agent: "content-agent",
                status: "completed",
                duration: `${((Date.now() - contentStart) / 1000).toFixed(1)}s`,
                output: {
                    postsGenerated: (contentRes.data?.tiktokHooks?.length || 0) + (contentRes.data?.linkedinPosts?.length || 0),
                    platforms: params.targetPlatforms
                }
            });

            // --- STEP 2: SDR Agent ---
            // Transform content topic into a targeted outreach context
            const sdrStart = Date.now();
            // We simulate a lead based on the target audience to get an outreach template
            const mockLead = {
                name: "Target Reader",
                company: params.targetAudience || "Industry Leader",
                role: "Decision Maker",
                linkedinUrl: "linkedin.com/in/target",
                website: "company.com"
            };

            const sdrRes = await callAgent("sdr/qualify-lead", {
                leadData: mockLead
            }, baseUrl);

            steps.push({
                agent: "sdr-agent",
                status: "completed",
                duration: `${((Date.now() - sdrStart) / 1000).toFixed(1)}s`,
                output: {
                    outreachMessages: 1, // Generated 1 template
                    personalizationScore: sdrRes.score || 85
                }
            });

            // --- STEP 3: Ops Agent ---
            const opsStart = Date.now();
            const opsRes = await callAgent("ops/automate-task", {
                task: "Log content-to-leads workflow execution and formatting",
                data: { workflowId, stepsCount: steps.length }
            }, baseUrl);

            steps.push({
                agent: "ops-agent",
                status: "completed",
                duration: `${((Date.now() - opsStart) / 1000).toFixed(1)}s`,
                output: {
                    metricsLogged: true,
                    reportGenerated: true
                }
            });

            // --- STEP 4: Growth Agent ---
            const growthStart = Date.now();
            const growthRes = await callAgent("growth/analyze", {
                metrics: { potentialReach: 50000, contentPieces: steps[0].output.postsGenerated },
                marketContext: `Campaign targeting ${params.targetAudience} using video content`
            }, baseUrl);

            steps.push({
                agent: "growth-agent",
                status: "completed",
                duration: `${((Date.now() - growthStart) / 1000).toFixed(1)}s`,
                output: {
                    estimatedReach: 50000,
                    recommendationsCount: growthRes.recommendations?.length || 0
                }
            });

            // Final Results
            logData = {
                workflowId,
                type: workflow,
                status: "completed",
                steps,
                startTime: new Date(startTime).toISOString(),
                endTime: new Date().toISOString(),
                totalDuration: `${((Date.now() - startTime) / 1000).toFixed(1)}s`,
                results: {
                    totalPosts: steps[0].output.postsGenerated,
                    totalOutreach: steps[1].output.outreachMessages,
                    estimatedLeads: 25, // Mocked estimation
                    timeToComplete: `${((Date.now() - startTime) / 1000).toFixed(1)}s`
                }
            };
        } else {
            return NextResponse.json({ error: "Workflow not supported yet" }, { status: 400 });
        }

        // Unify Logging
        await adminDb.collection("workflow_executions").doc(workflowId).set(logData);

        return NextResponse.json(logData);

    } catch (error: any) {
        console.error("Orchestration Error:", error);
        return NextResponse.json(
            { error: "Workflow failed", details: error.message },
            { status: 500 }
        );
    }
}
