/**
 * Call List Page - Server Component
 *
 * Fetches calls from API and displays them in a grid
 * Supports dynamic orgId via searchParams
 */

import { Suspense } from 'react';
import { CallCard } from '@/components/dashboard/CallCard';
import { GetCallsResponse } from '@/lib/types/call';

interface PageProps {
  searchParams: {
    orgId?: string;
  };
}

// Loading skeleton component
function CallsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-48 bg-gray-200 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
}

// Empty state component
function EmptyState({ organizationId }: { organizationId?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-6xl mb-4">📞</div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        Nog geen calls
      </h2>
      <p className="text-gray-600 text-center max-w-md">
        {organizationId
          ? 'Er zijn nog geen calls ontvangen voor deze organisatie.'
          : 'Selecteer een organisatie via de orgId parameter.'}
      </p>
      {!organizationId && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Tip:</strong> Voeg <code className="bg-blue-100 px-2 py-1 rounded">?orgId=xxx</code> toe aan de URL
          </p>
        </div>
      )}
    </div>
  );
}

// Error state component
function ErrorState({ error }: { error: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-semibold text-red-600 mb-2">
        Fout bij ophalen calls
      </h2>
      <p className="text-gray-600 text-center max-w-md mb-4">
        {error}
      </p>
      <a
        href={typeof window !== 'undefined' ? window.location.href : '/dashboard/calls'}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-block"
      >
        Probeer opnieuw
      </a>
    </div>
  );
}

// Fetch calls from API
async function fetchCalls(orgId: string): Promise<GetCallsResponse> {
  // Use absolute URL for server-side fetching
  // In production, NEXT_PUBLIC_API_URL should be set to your domain
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ||
                  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                  'http://localhost:3001';

  const url = `${baseUrl}/api/get-calls?orgId=${encodeURIComponent(orgId)}`;

  console.log(`[Dashboard] Fetching calls from: ${url}`);

  try {
    const response = await fetch(url, {
      cache: 'no-store', // Always fetch fresh data
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`
      }));
      throw new Error(errorData.error || `Failed to fetch calls (${response.status})`);
    }

    const data = await response.json();
    console.log(`[Dashboard] Fetched ${data.totalCalls} calls for org: ${orgId}`);
    return data;
  } catch (error: any) {
    console.error('[Dashboard] Fetch error:', error);
    throw error;
  }
}

// Main page component
export default async function CallsPage({ searchParams }: PageProps) {
  const orgId = searchParams.orgId;

  // No orgId provided
  if (!orgId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          📞 Calls Dashboard
        </h1>
        <EmptyState />
      </div>
    );
  }

  // Fetch calls
  let callsData: GetCallsResponse;
  try {
    callsData = await fetchCalls(orgId);
  } catch (error: any) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          📞 Calls Dashboard
        </h1>
        <ErrorState error={error.message} />
      </div>
    );
  }

  const { tenant, calls, totalCalls } = callsData;

  // Count shield calls
  const shieldCalls = calls.filter((c) => c.mode === 'DEFENSIVE');
  const criticalCalls = calls.filter((c) => c.priority === 'CRITICAL');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📞 Calls Dashboard
        </h1>
        <p className="text-gray-600">
          Organisatie: <span className="font-semibold">{tenant.name}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Totaal Calls</div>
          <div className="text-3xl font-bold text-gray-900">{totalCalls}</div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
          <div className="text-sm text-red-600 mb-1">🛡️ Shield Mode</div>
          <div className="text-3xl font-bold text-red-600">{shieldCalls.length}</div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
          <div className="text-sm text-orange-600 mb-1">⚠️ Critical</div>
          <div className="text-3xl font-bold text-orange-600">{criticalCalls.length}</div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
          <div className="text-sm text-blue-600 mb-1">💼 Sales</div>
          <div className="text-3xl font-bold text-blue-600">
            {calls.length - shieldCalls.length}
          </div>
        </div>
      </div>

      {/* Call List */}
      {calls.length === 0 ? (
        <EmptyState organizationId={orgId} />
      ) : (
        <>
          {/* Shield Calls First */}
          {shieldCalls.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-red-600 mb-4 flex items-center gap-2">
                🛡️ Shield Mode Alerts ({shieldCalls.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shieldCalls.map((call) => (
                  <CallCard key={call.id} call={call} />
                ))}
              </div>
            </div>
          )}

          {/* Sales Calls */}
          {calls.length > shieldCalls.length && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                💼 Sales & FAQ Calls ({calls.length - shieldCalls.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {calls
                  .filter((c) => c.mode !== 'DEFENSIVE')
                  .map((call) => (
                    <CallCard key={call.id} call={call} />
                  ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>
          Data-isolatie actief 🛡️ | Alleen calls van {tenant.name} worden
          getoond
        </p>
      </div>
    </div>
  );
}
