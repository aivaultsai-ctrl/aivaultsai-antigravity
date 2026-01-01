import OpenAI from 'openai';
import { AIExtractionInput, AIExtractionResult } from '../types/ai.types';
import { logger } from '../config/logger';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function extractLeadWithAI(
    input: AIExtractionInput
): Promise<AIExtractionResult> {
    try {
        const response = await openai.beta.chat.completions.parse({
            model: 'gpt-4o',
            temperature: 0,
            messages: [
                {
                    role: 'system',
                    content: `
${input.systemPrompt}

Je bent een Nederlandse AI-telefoniste met twee modi:
1. SALES (Intent: LEAD, FAQ) - Behulpzaam, wervend.
2. DEFENSIVE (Intent: FINANCIAL, SPAM) - Zakelijk, afhoudend, "Shield Mode".

Regels:
- Als de beller belt over facturen, betalingen of schulden -> Intent: FINANCIAL, Mode: DEFENSIVE.
- Als de beller iets wil kopen of informatie wil -> Intent: LEAD/FAQ, Mode: SALES.
- In DEFENSIVE mode: Verwijs naar e-mail. Leg invoice_number en email vast. Doe GEEN toezeggingen.

Je antwoordt UITSLUITEND in geldig JSON volgens het schema.
Vul alle velden zo goed mogelijk in op basis van het transcript.
Geen uitleg. Geen extra tekst.
`
                },
                {
                    role: 'user',
                    content: `
Transcript van het gesprek:
${input.transcript}

Relevante FAQ context:
${JSON.stringify(input.faqContext)}
`
                }
            ],
            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: 'lead_extraction',
                    strict: true,
                    schema: {
                        type: 'object',
                        properties: {
                            // Contact Details
                            customer_name: { type: ['string', 'null'] },
                            phone_number: { type: ['string', 'null'] },
                            email: { type: ['string', 'null'] },

                            // Financial / Shield Mode Details
                            invoice_number: { type: ['string', 'null'] },
                            company_name: { type: ['string', 'null'] },
                            contact_name: { type: ['string', 'null'] },

                            // Classification
                            intent: {
                                type: 'string',
                                enum: ['LEAD', 'FAQ', 'FINANCIAL', 'SPAM']
                            },
                            mode: {
                                type: 'string',
                                enum: ['SALES', 'DEFENSIVE']
                            },
                            priority: {
                                type: 'string',
                                enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
                            },
                            urgency: { // Backward compat
                                type: 'string',
                                enum: ['laag', 'normaal', 'hoog']
                            },

                            // Context
                            summary: { type: ['string', 'null'] },
                            appointment_request: { type: 'boolean' },
                            is_faq: { type: 'boolean' }
                        },
                        required: [
                            'customer_name',
                            'phone_number',
                            'email',
                            'invoice_number',
                            'company_name',
                            'contact_name',
                            'intent',
                            'mode',
                            'priority',
                            'urgency',
                            'summary',
                            'appointment_request',
                            'is_faq'
                        ],
                        additionalProperties: false
                    }
                }
            }
        });

        const parsed = response.choices[0].message.parsed;
        if (!parsed) {
            throw new Error('AI response could not be parsed as structured JSON');
        }

        return parsed as AIExtractionResult;
    } catch (err) {
        logger.error({ err }, 'AI extractie mislukt');
        throw err;
    }
}
