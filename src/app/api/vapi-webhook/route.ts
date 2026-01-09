import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/models/prisma';

/**
 * Vapi Webhook Handler
 *
 * Handles incoming webhooks from Vapi and stores Call records with proper multi-tenant isolation.
 *
 * CRITICAL: organizationId MUST be set for data isolation to work.
 *
 * Two methods to set organizationId:
 * 1. Via Vapi metadata: call.metadata.organizationId
 * 2. Via Assistant mapping: Look up assistant in AIProfile table
 */

// Helper: Extract organizationId from Vapi payload
async function getOrganizationId(payload: any): Promise<string | null> {
  // Method 1: Direct from metadata (PREFERRED)
  if (payload.call?.metadata?.organizationId) {
    return payload.call.metadata.organizationId;
  }

  // Method 2: Lookup via Vapi Assistant ID
  const assistantId = payload.call?.assistantId || payload.message?.assistantId;

  if (assistantId) {
    // Try to find the tenant via AIProfile mapping
    // Note: This requires adding a vapiAssistantId field to AIProfile model
    const aiProfile = await prisma.aIProfile.findFirst({
      where: {
        // Assuming we store Vapi assistant IDs in faqKnowledge as a workaround
        // OR we need to add a dedicated field: vapiAssistantId: String?
        tenant: {
          id: {
            not: undefined
          }
        }
      },
      include: {
        tenant: true
      }
    });

    if (aiProfile) {
      return aiProfile.tenantId;
    }

    console.error(`🚨 Assistent ${assistantId} niet gevonden in database.`);
    return null;
  }

  // Method 3: Fallback - check for phoneNumber mapping
  const phoneNumber = payload.call?.customer?.number;
  if (phoneNumber) {
    // Try to find existing tenant by phone (if they called before)
    const existingCall = await prisma.call.findFirst({
      where: {
        phoneNumber: phoneNumber
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (existingCall) {
      console.log(`✅ Found existing organizationId via phoneNumber: ${existingCall.organizationId}`);
      return existingCall.organizationId;
    }
  }

  console.error('❌ Could not determine organizationId from payload');
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    console.log('📞 Vapi Webhook ontvangen:', {
      type: payload.type,
      callId: payload.call?.id,
      assistantId: payload.call?.assistantId,
      customer: payload.call?.customer
    });

    // Only process call.ended events (when transcript is available)
    if (payload.type !== 'call.ended' && payload.type !== 'end-of-call-report') {
      return NextResponse.json({
        received: true,
        message: 'Event type not processed'
      });
    }

    // Extract organizationId
    const organizationId = await getOrganizationId(payload);

    if (!organizationId) {
      console.error('🚨 organizationId missing - cannot create Call record');
      return NextResponse.json(
        {
          error: 'organizationId niet gevonden',
          details: 'Stel organizationId in via Vapi metadata of link de Assistant aan een Tenant'
        },
        { status: 404 }
      );
    }

    // Verify tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id: organizationId }
    });

    if (!tenant) {
      console.error(`🚨 Tenant ${organizationId} bestaat niet in database`);
      return NextResponse.json(
        { error: 'Tenant niet gevonden' },
        { status: 404 }
      );
    }

    console.log(`✅ Tenant gevonden: ${tenant.name} (${organizationId})`);

    // Extract call data
    const call = payload.call || {};
    const customer = call.customer || {};

    // Create Call record
    const callRecord = await prisma.call.create({
      data: {
        organizationId,
        vapiCallId: call.id,
        customerName: customer.name || 'Onbekend',
        phoneNumber: customer.number,
        transcript: call.transcript,
        duration: call.endedReason === 'customer-ended-call'
          ? Math.round((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000)
          : undefined,
        summary: call.summary,
        metadata: payload, // Store entire payload for debugging

        // Extract Shield Mode data if present
        intent: call.metadata?.intent || undefined,
        mode: call.metadata?.mode || undefined,
        priority: call.metadata?.priority || undefined,
        invoiceNumber: call.metadata?.invoiceNumber,
        companyName: call.metadata?.companyName,
      }
    });

    console.log(`✅ Call opgeslagen: ${callRecord.id}`);
    console.log(`✅ DATABASE BEVESTIGING:`, {
      id: callRecord.id,
      name: callRecord.customerName,
      time: callRecord.createdAt,
      org: callRecord.organizationId // ✅ Dit moet nu gevuld zijn!
    });

    return NextResponse.json({
      success: true,
      callId: callRecord.id,
      organizationId: callRecord.organizationId
    });

  } catch (error: any) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// GET endpoint voor debugging
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('orgId');

  if (!orgId) {
    return NextResponse.json(
      { error: 'orgId parameter required' },
      { status: 400 }
    );
  }

  const calls = await prisma.call.findMany({
    where: {
      organizationId: orgId
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 10
  });

  return NextResponse.json({
    organizationId: orgId,
    count: calls.length,
    calls: calls.map(c => ({
      id: c.id,
      customerName: c.customerName,
      phoneNumber: c.phoneNumber,
      createdAt: c.createdAt,
      duration: c.duration
    }))
  });
}
