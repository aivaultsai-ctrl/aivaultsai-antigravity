import { prisma } from '../models/prisma';
import { extractLeadWithAI } from '../services/ai.service';
import { semanticFAQSearch } from '../services/faq.service';
import { notifyEntrepreneur, sendShieldNotification } from '../services/notification.service';
import { LeadJobData } from '../queue/lead.queue';
import { logger } from '../config/logger';

export async function processLeadJob(data: LeadJobData) {
    const { tenantId, transcript } = data;

    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: { aiProfile: true }
    });

    if (!tenant || !tenant.aiProfile) {
        throw new Error('Tenant of AI-profiel niet gevonden.');
    }

    let extracted: any = null;
    let requiresReview = false;

    try {
        const relevantFaqs = await semanticFAQSearch(
            tenant.id,
            transcript
        );

        extracted = await extractLeadWithAI({
            transcript,
            faqContext: relevantFaqs,
            systemPrompt: tenant.aiProfile.systemPrompt
        });
    } catch (err) {
        logger.error({ err }, 'AI extractie mislukt, manual review nodig');
        requiresReview = true;
    }

    const call = await prisma.call.create({
        data: {
            organizationId: tenant.id, // Updated: was tenantId
            // Contact Info
            customerName: extracted?.customer_name ?? null,
            phoneNumber: extracted?.phone_number ?? null,
            email: extracted?.email ?? null,

            // AI Classification
            intent: extracted?.intent as any ?? 'LEAD',
            mode: extracted?.mode as any ?? 'SALES',
            priority: extracted?.priority as any ?? 'LOW',

            // Content
            summary: extracted?.summary ?? null,
            transcript: transcript,
            invoiceNumber: extracted?.invoice_number ?? null,
            appointment: extracted?.appointment_request ?? false,

            requiresReview: requiresReview || (extracted?.mode === 'DEFENSIVE')
        }
    });

    // 🛡️ SHIELD MODE NOTIFICATION (Enhanced)
    if (call.mode === 'DEFENSIVE') {
        logger.info({ callId: call.id, priority: call.priority }, '🛡️ Shield Mode active for call');

        // Get tenant notification preferences
        const notificationPhone = (tenant as any).ownerPhone || (tenant as any).notificationPhone;

        if (notificationPhone) {
            await sendShieldNotification({
                to: notificationPhone,
                tenantName: tenant.name,
                invoiceNumber: call.invoiceNumber || undefined,
                companyName: call.companyName || undefined,
                priority: (call.priority as 'HIGH' | 'CRITICAL') || 'HIGH',
                summary: call.summary || 'Financiële kwestie - zie dashboard voor details',
                callTimestamp: call.createdAt,
                preferWhatsApp: (tenant as any).preferWhatsApp || false
            });
        } else {
            logger.warn({ tenantId: tenant.id }, 'No notification phone configured for tenant');
        }
    }

    await notifyEntrepreneur(tenant, call);
}
