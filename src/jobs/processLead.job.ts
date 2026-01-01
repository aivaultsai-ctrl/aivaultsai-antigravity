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

    const lead = await prisma.lead.create({
        data: {
            tenantId: tenant.id,
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
    if (lead.mode === 'DEFENSIVE') {
        logger.info({ leadId: lead.id, priority: lead.priority }, '🛡️ Shield Mode active for lead');

        // Get tenant notification preferences
        const notificationPhone = (tenant as any).ownerPhone || (tenant as any).notificationPhone;

        if (notificationPhone) {
            await sendShieldNotification({
                to: notificationPhone,
                tenantName: tenant.name,
                invoiceNumber: lead.invoiceNumber || undefined,
                companyName: lead.companyName || undefined,
                priority: (lead.priority as 'HIGH' | 'CRITICAL') || 'HIGH',
                summary: lead.summary || 'Financiële kwestie - zie dashboard voor details',
                callTimestamp: lead.createdAt,
                preferWhatsApp: (tenant as any).preferWhatsApp || false
            });
        } else {
            logger.warn({ tenantId: tenant.id }, 'No notification phone configured for tenant');
        }
    }

    await notifyEntrepreneur(tenant, lead);
}
