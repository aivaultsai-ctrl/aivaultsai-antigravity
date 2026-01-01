import { Queue } from 'bullmq';
import { redis } from './redis';

export interface LeadJobData {
    tenantId: string;
    transcript: string;
    callId: string;
}

export const leadQueue = new Queue<LeadJobData>('lead-processing', {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 3000
        },
        removeOnComplete: true,
        removeOnFail: false
    }
});
