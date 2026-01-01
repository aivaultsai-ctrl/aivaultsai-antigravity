import OpenAI from 'openai';
import { prisma } from '../models/prisma';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function semanticFAQSearch(
    tenantId: string,
    transcript: string,
    limit = 3
) {
    // 1. Embed transcript
    const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: transcript
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // 2. Vector similarity search
    const results = await prisma.$queryRawUnsafe<
        Array<{ question: string; answer: string; score: number }>
    >(
        `
    SELECT
      question,
      answer,
      1 - (embedding <=> $1::vector) AS score
    FROM "FAQEmbedding"
    WHERE "tenantId" = $2
    ORDER BY embedding <=> $1::vector
    LIMIT $3
    `,
        queryEmbedding,
        tenantId,
        limit
    );

    return results.map(r => ({
        question: r.question,
        answer: r.answer
    }));
}
