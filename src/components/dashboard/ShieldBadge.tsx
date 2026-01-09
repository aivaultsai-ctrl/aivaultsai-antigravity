/**
 * Shield Badge Component
 *
 * Visual indicator for Shield Mode (DEFENSIVE) calls
 * Shows CRITICAL and HIGH priority alerts prominently
 */

import { CallMode, CallPriority } from '@/lib/types/call';
import { cn } from '@/lib/utils';

interface ShieldBadgeProps {
  mode: CallMode | null;
  priority: CallPriority | null;
  className?: string;
}

export function ShieldBadge({ mode, priority, className }: ShieldBadgeProps) {
  // Only show badge for DEFENSIVE mode
  if (mode !== 'DEFENSIVE') {
    return null;
  }

  const isCritical = priority === 'CRITICAL';
  const isHigh = priority === 'HIGH';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold',
        'border-2 shadow-md',
        isCritical && 'bg-red-600 border-red-700 text-white animate-pulse',
        isHigh && 'bg-orange-600 border-orange-700 text-white',
        !isCritical && !isHigh && 'bg-yellow-600 border-yellow-700 text-white',
        className
      )}
    >
      <span className="text-base">🛡️</span>
      <span>Shield Mode</span>
      {isCritical && (
        <span className="ml-1 px-2 py-0.5 bg-red-800 rounded text-xs">
          CRITICAL
        </span>
      )}
      {isHigh && (
        <span className="ml-1 px-2 py-0.5 bg-orange-800 rounded text-xs">
          HIGH
        </span>
      )}
    </div>
  );
}

/**
 * Compact Shield Icon (for use in tables/lists)
 */
export function ShieldIcon({ mode, priority }: { mode: CallMode | null; priority: CallPriority | null }) {
  if (mode !== 'DEFENSIVE') return null;

  const isCritical = priority === 'CRITICAL';

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs',
        isCritical ? 'bg-red-600 animate-pulse' : 'bg-orange-600'
      )}
      title="Shield Mode"
    >
      🛡️
    </span>
  );
}
