import { Request, Response, NextFunction } from 'express';
import { leadQueue } from '../queue/lead.queue';

export async function inboundCallHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const tenant = (req as any).tenant;
    const { transcript, call_id } = req.body;

    if (!transcript || !call_id) {
        return res.status(400).json({ error: 'Transcript of call_id ontbreekt.' });
    }

    try {
        await leadQueue.add(
            'process-lead',
            {
                tenantId: tenant.id,
                transcript,
                callId: call_id
            },
            {
                jobId: `${tenant.id}:${call_id}` // idempotency
            }
        );

        // ⏱️ <100ms response voor VAPI / Retell
        return res.status(200).json({ status: 'queued' });
    } catch (err) {
        next(err);
    }
}
