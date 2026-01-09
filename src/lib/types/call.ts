/**
 * Type definitions for Call entities
 * Aligned with Prisma Call model
 */

import { Call as PrismaCall, CallIntent, CallMode, CallPriority } from '@prisma/client';

// Re-export Prisma types for convenience
export type { CallIntent, CallMode, CallPriority };

// Full Call type from Prisma
export type Call = PrismaCall;

// API Response type for /api/get-calls
export interface GetCallsResponse {
  success: boolean;
  tenant: {
    id: string;
    name: string;
  };
  organizationId: string;
  totalCalls: number;
  calls: Call[];
  dataIsolation: {
    status: string;
    message: string;
    test?: string;
  };
}

// UI-friendly Call display type
export interface CallDisplay extends Call {
  // Add computed properties if needed
  relativeTime?: string;
  priorityColor?: string;
  modeLabel?: string;
}

// Filter options for Call List
export interface CallFilters {
  mode?: CallMode | 'all';
  priority?: CallPriority | 'all';
  intent?: CallIntent | 'all';
  search?: string;
}

// Helper function to get priority color
export function getPriorityColor(priority: CallPriority | null): string {
  switch (priority) {
    case 'CRITICAL':
      return 'bg-red-500 text-white';
    case 'HIGH':
      return 'bg-orange-500 text-white';
    case 'MEDIUM':
      return 'bg-yellow-500 text-gray-900';
    case 'LOW':
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

// Helper function to get priority label
export function getPriorityLabel(priority: CallPriority | null): string {
  return priority || 'UNKNOWN';
}

// Helper function to get mode badge color
export function getModeBadgeColor(mode: CallMode | null): string {
  return mode === 'DEFENSIVE'
    ? 'bg-red-600 text-white border-red-700'
    : 'bg-blue-600 text-white border-blue-700';
}

// Helper function to get mode label
export function getModeLabel(mode: CallMode | null): string {
  switch (mode) {
    case 'DEFENSIVE':
      return '🛡️ Shield Mode';
    case 'SALES':
      return '💼 Sales Mode';
    default:
      return 'Unknown';
  }
}

// Helper function to get intent icon
export function getIntentIcon(intent: CallIntent | null): string {
  switch (intent) {
    case 'FINANCIAL':
      return '💰';
    case 'LEAD':
      return '🎯';
    case 'FAQ':
      return '❓';
    case 'SPAM':
      return '🗑️';
    default:
      return '📞';
  }
}

// Helper function to format relative time
export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const callDate = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - callDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Zojuist';
  if (diffMins < 60) return `${diffMins} min geleden`;
  if (diffHours < 24) return `${diffHours} uur geleden`;
  if (diffDays < 7) return `${diffDays} dag${diffDays > 1 ? 'en' : ''} geleden`;

  return callDate.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: callDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

// Helper to format duration
export function formatDuration(seconds: number | null): string {
  if (!seconds) return '0s';

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}
