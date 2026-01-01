import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

async function main() {
    try {
        console.log('Testing connection with @prisma/adapter-pg...');
        const connectionString = process.env.DATABASE_URL;
        const pool = new pg.Pool({ connectionString });
        const adapter = new PrismaPg(pool);
        const prisma = new PrismaClient({ adapter });

        const count = await prisma.tenant.count();
        console.log('Tenant count:', count);
        await prisma.$disconnect();
    } catch (error: any) {
        console.error('Database connection failed!');
        console.error('Message:', error.message);
        process.exit(1);
    }
}

main();
