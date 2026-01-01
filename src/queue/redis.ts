import { Redis } from 'ioredis';
import { logger } from '../config/logger';

export const redis = new Redis(process.env.REDIS_URL as string, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    reconnectOnError(err) {
        logger.error({ err }, 'Redis reconnect triggered');
        return true;
    },
    retryStrategy(times) {
        const delay = Math.min(times * 100, 2000);
        return delay;
    }
});

redis.on('connect', () => {
    logger.info('Redis connected');
});

redis.on('error', err => {
    logger.error({ err }, 'Redis error');
});
