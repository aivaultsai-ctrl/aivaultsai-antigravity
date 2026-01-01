import twilio from 'twilio';
import { logger } from '../config/logger';

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

/**
 * Shield Notification Payload
 * Bevat alle relevante informatie over de Shield Mode activatie
 */
export interface ShieldNotificationPayload {
    to: string | string[]; // Phone number(s) or WhatsApp number
    tenantName: string;
    invoiceNumber?: string;
    companyName?: string;
    priority: 'HIGH' | 'CRITICAL';
    summary: string;
    callTimestamp: Date;
    preferWhatsApp?: boolean; // Send via WhatsApp instead of SMS
}

/**
 * 🛡️ SHIELD MODE NOTIFICATION
 * 
 * Stuurt een onmiddellijke alert naar de ondernemer wanneer:
 * - Een incassobureau belt
 * - Een schuldeiser contact zoekt
 * - Er over facturen/betalingen wordt gesproken
 * 
 * De AI heeft deze persoon al netjes afgewimpeld, deze notificatie is
 * puur voor awareness en gemoedsrust.
 */
export async function sendShieldNotification(payload: ShieldNotificationPayload) {
    const {
        to,
        tenantName,
        invoiceNumber,
        companyName,
        priority,
        summary,
        callTimestamp,
        preferWhatsApp = false
    } = payload;

    // Construct the alert message
    const priorityEmoji = priority === 'CRITICAL' ? '🚨' : '🛡️';
    const timestamp = callTimestamp.toLocaleString('nl-NL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const body = `${priorityEmoji} Slimme Telefoniste – ${priority === 'CRITICAL' ? 'KRITIEKE WAARSCHUWING' : 'Schild Actief'}

${priority === 'CRITICAL' ? '⚠️ Er is mogelijk sprake van dreigingen of escalatie.\n' : ''}
Tijd: ${timestamp}
${companyName ? `Bedrijf: ${companyName}\n` : ''}${invoiceNumber ? `Factuur: ${invoiceNumber}\n` : ''}
Context: ${summary}

✅ De AI heeft de beller verwezen naar schriftelijke afhandeling.
✅ Er zijn GEEN toezeggingen gedaan.
✅ Je hoeft NIETS te doen.

${priority === 'CRITICAL' ? '💡 Overweeg dit door te spelen aan je juridisch adviseur.' : '💡 Dit gesprek is automatisch gelogd in je dashboard.'}`;

    try {
        if (!twilioClient) {
            logger.warn('Twilio credentials not set, skipping notification');
            logger.info({ to, body, payload }, '🛡️ MOCK SHIELD ALERT GENERATED');
            return { success: false, mock: true };
        }

        const recipients = Array.isArray(to) ? to : [to];
        const results = [];

        for (const recipient of recipients) {
            try {
                // WhatsApp or SMS
                const fromNumber = preferWhatsApp
                    ? `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER || process.env.TWILIO_PHONE_NUMBER}`
                    : process.env.TWILIO_PHONE_NUMBER;

                const toNumber = preferWhatsApp
                    ? `whatsapp:${recipient}`
                    : recipient;

                const message = await twilioClient.messages.create({
                    body: body,
                    from: fromNumber,
                    to: toNumber
                });

                results.push({
                    recipient,
                    messageSid: message.sid,
                    success: true
                });

                logger.info({
                    recipient,
                    tenantName,
                    priority,
                    method: preferWhatsApp ? 'WhatsApp' : 'SMS',
                    messageSid: message.sid
                }, '🛡️ Shield notification sent successfully');

            } catch (recipientError) {
                logger.error({
                    error: recipientError,
                    recipient,
                    tenantName
                }, 'Failed to send Shield notification to recipient');

                results.push({
                    recipient,
                    success: false,
                    error: recipientError
                });
            }
        }

        return {
            success: results.some(r => r.success),
            results
        };

    } catch (error) {
        logger.error({ error, payload }, 'Critical failure in Shield notification system');
        // We do NOT throw - notification failure should not crash the job
        return { success: false, error };
    }
}

/**
 * 📧 LEAD NOTIFICATION
 * 
 * Stuurt een positieve notificatie wanneer er een nieuwe lead is
 */
export async function sendLeadNotification({
    to,
    tenantName,
    customerName,
    summary,
    intent
}: {
    to: string;
    tenantName: string;
    customerName?: string;
    summary: string;
    intent: 'LEAD' | 'FAQ';
}) {
    const emoji = intent === 'LEAD' ? '🎯' : '💬';
    const body = `${emoji} Nieuwe ${intent === 'LEAD' ? 'Lead' : 'Vraag'} via Slimme Telefoniste

${customerName ? `Naam: ${customerName}\n` : ''}Context: ${summary}

💡 Check je dashboard voor meer details.`;

    try {
        if (!twilioClient) {
            logger.info({ to, body }, 'MOCK Lead notification generated');
            return;
        }

        await twilioClient.messages.create({
            body: body,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        });

        logger.info({ to, tenantName, intent }, 'Lead notification sent successfully');
    } catch (error) {
        logger.error({ error, to }, 'Failed to send Lead notification');
    }
}

/**
 * Backward compatibility - deprecated in favor of specific notification functions
 */
export async function notifyEntrepreneur(tenant: any, lead: any) {
    logger.info(`[DEPRECATED] Use sendShieldNotification or sendLeadNotification instead`);
    logger.info(`Lead processed for ${tenant.id}. ID: ${lead.id}. Mode: ${lead.mode}`);
}
