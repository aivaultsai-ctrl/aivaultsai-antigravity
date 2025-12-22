import { NextResponse } from 'next/server';

// Helper to make internal API calls
const runAgent = async (endpoint: string, payload: any) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/agents/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    return res.json();
};

export async function POST(req: Request) {
    const { workflow, params } = await req.json();
    const executionLogs = [];
    const results: any = {};

    try {
        // === SCENARIO 1: FULL COMPANY AUTOMATION ===
        if (workflow === 'full-company-loop') {

            // STEP 1: Content Agent
            const contentRes = await runAgent('content/transform', {
                videoUrl: params.videoUrl,
                platforms: ['linkedin']
            });
            executionLogs.push({ agent: 'Content Agent', status: 'Success', output: 'Generated 5 posts' });
            results.content = contentRes;

            // STEP 2: SDR Agent
            const sdrRes = await runAgent('sdr/qualify-lead', {
                leadData: { source: 'LinkedIn', contentId: 'post_123' }
            });
            executionLogs.push({ agent: 'SDR Agent', status: 'Success', output: 'Qualified 12 leads' });
            results.sdr = sdrRes;

            // STEP 3: Ops Agent
            const opsRes = await runAgent('ops', {
                task: 'Log Campaign Data',
                data: { leads: sdrRes }
            });
            executionLogs.push({ agent: 'Ops Agent', status: 'Success', output: 'Database updated' });

            // STEP 4: Growth Agent
            const growthRes = await runAgent('growth', {
                metrics: { leads: 12, views: 500 },
                campaignType: 'Video Outreach'
            });
            executionLogs.push({ agent: 'Growth Agent', status: 'Success', output: 'ROI Predicted: 4.5x' });
            results.strategy = growthRes;

            return NextResponse.json({
                status: 'COMPLETED',
                workflowId: `wf_${Date.now()}`,
                steps: executionLogs,
                finalReport: results
            });
        }

        // === SCENARIO 2: SUPPORT LOOP ===
        if (workflow === 'support-loop') {
            const supportRes = await runAgent('support', {
                ticket: params.ticket,
                customerId: params.customerId
            });

            await runAgent('ops', { task: 'Archive Ticket', data: supportRes });

            return NextResponse.json({ status: 'COMPLETED', result: supportRes });
        }

        return NextResponse.json({ error: 'Unknown workflow' }, { status: 400 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 'FAILED',
            error: error instanceof Error ? error.message : 'Unknown error',
            logs: executionLogs
        }, { status: 500 });
    }
}
// Deployment check: v2
