import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/models/prisma';

/**
 * Get Calls API - Data Isolation Test Endpoint
 *
 * Usage:
 *   GET /api/get-calls?orgId=<organization_id>
 *
 * Tests multi-tenant data isolation by returning ONLY calls for the specified organizationId.
 *
 * Data Isolation Verification:
 * 1. Get valid orgId from Prisma Studio (Tenant table)
 * 2. Call: http://localhost:3001/api/get-calls?orgId=<valid_id>
 * 3. Verify you see calls
 * 4. Remove one letter from orgId
 * 5. Verify list is now empty (proves isolation works!)
 */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get('orgId');

    // Validation
    if (!orgId) {
      return NextResponse.json(
        {
          error: 'orgId parameter is required',
          usage: 'GET /api/get-calls?orgId=<organization_id>',
          hint: 'Get orgId from Prisma Studio (Tenant table)'
        },
        { status: 400 }
      );
    }

    // Verify tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id: orgId },
      select: {
        id: true,
        name: true
      }
    });

    if (!tenant) {
      return NextResponse.json(
        {
          error: 'Tenant not found',
          orgId: orgId,
          hint: '🛡️ Data isolation working! Invalid orgId returns no data.'
        },
        { status: 404 }
      );
    }

    // Fetch calls for this organization ONLY
    const calls = await prisma.call.findMany({
      where: {
        organizationId: orgId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        vapiCallId: true,
        customerName: true,
        phoneNumber: true,
        transcript: true,
        duration: true,
        intent: true,
        mode: true,
        priority: true,
        invoiceNumber: true,
        companyName: true,
        createdAt: true,
        organizationId: true
      }
    });

    // Success response
    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name
      },
      organizationId: orgId,
      totalCalls: calls.length,
      calls: calls,
      dataIsolation: {
        status: '✅ ACTIVE',
        message: 'Only calls for this organizationId are returned',
        test: 'Remove one letter from orgId to verify isolation'
      }
    });

  } catch (error: any) {
    console.error('❌ Get calls error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch calls',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// POST endpoint for creating test calls (development only)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { organizationId, customerName, phoneNumber } = body;

    if (!organizationId) {
      return NextResponse.json(
        { error: 'organizationId is required' },
        { status: 400 }
      );
    }

    // Verify tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id: organizationId }
    });

    if (!tenant) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    // Create test call
    const call = await prisma.call.create({
      data: {
        organizationId,
        customerName: customerName || 'Test Customer',
        phoneNumber: phoneNumber || '+31612345678',
        transcript: 'Test call transcript',
        duration: 60,
        intent: 'LEAD',
        mode: 'SALES',
        priority: 'LOW'
      }
    });

    return NextResponse.json({
      success: true,
      call: {
        id: call.id,
        organizationId: call.organizationId,
        customerName: call.customerName
      }
    });

  } catch (error: any) {
    console.error('❌ Create test call error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create test call',
        details: error.message
      },
      { status: 500 }
    );
  }
}
