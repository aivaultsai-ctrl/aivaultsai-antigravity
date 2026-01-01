import { Worker } from 'bullmq';
import { redis } from '../queue/redis';
import { processLeadJob } from './processLead.job';
import { logger } from '../config/logger';

const worker = new Worker(
    'lead-processing',
    async job => {
        await processLeadJob(job.data);
    },
    {
        connection: redis,
        concurrency: 5
    }
);

worker.on('completed', job => {
    logger.info({ jobId: job.id }, 'Lead job completed');
});

worker.on('failed', (job, err) => {
    logger.error(
        { jobId: job?.id, err },
        'Lead job failed'
    );
});

// Graceful shutdown
async function shutdown() {
    logger.info('Worker shutting down...');
    await worker.close();
    process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
