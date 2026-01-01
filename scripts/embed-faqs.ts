import OpenAI from 'openai';
import { prisma } from '../src/models/prisma';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function embedFaqs(tenantId: string) {
    if (!tenantId) {
        throw new Error('Please provide a TENANT_ID as argument');
    }

    const aiProfile = await prisma.aIProfile.findUnique({
        where: { tenantId }
    });

    if (!aiProfile) {
        throw new Error('AIProfile not found');
    }

    const faqs = aiProfile.faqKnowledge as Array<{
        question: string;
        answer: string;
    }>;

    if (!faqs || faqs.length === 0) {
        console.log('No FAQs found for this tenant.');
        return;
    }

    console.log(`Processing ${faqs.length} FAQs for tenant ${tenantId}...`);

    for (const faq of faqs) {
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: faq.question
        });

        const embedding = embeddingResponse.data[0].embedding;

        // Use queryRaw because Prisma Client doesn't support writing vector type directly via create() with Unsupported type
        // Wait, create() expects what for Unsupported? It expects a string usually? Or we simply cannot use create()?
        // Actually, for Unsupported fields, Prisma usually omits them in the generated type for `create` input UNLESS we use specific raw query or check if it accepts formatted string.
        // Documentation says: "You cannot write to an Unsupported field with the Prisma Client."
        // So we MUST use $executeRaw.

        await prisma.$executeRaw`
      INSERT INTO "FAQEmbedding" ("id", "tenantId", "question", "answer", "embedding", "createdAt")
      VALUES (gen_random_uuid(), ${tenantId}, ${faq.question}, ${faq.answer}, ${embedding}::vector, NOW())
    `;
    }

    console.log(`✅ Embedded ${faqs.length} FAQs for tenant ${tenantId}`);
}

embedFaqs(process.argv[2])
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
