import { PrismaClient } from '@prisma/client';

// Simple Prisma Client without adapter (compatible with Prisma 5.16.1)
// The adapter is only needed for edge deployments and requires Prisma 7+ or driverAdapters preview feature
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

