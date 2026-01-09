'use client';

/**
 * Call Card Component
 *
 * Displays individual call information in a card format
 * Handles click to show full transcript modal
 */

import { useState } from 'react';
import { Call, getPriorityColor, getIntentIcon, getRelativeTime, formatDuration } from '@/lib/types/call';
import { ShieldBadge } from './ShieldBadge';
import { cn } from '@/lib/utils';

interface CallCardProps {
  call: Call;
}

export function CallCard({ call }: CallCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isShieldMode = call.mode === 'DEFENSIVE';
  const priorityColor = getPriorityColor(call.priority);
  const intentIcon = getIntentIcon(call.intent);
  const relativeTime = getRelativeTime(call.createdAt);

  return (
    <div
      className={cn(
        'relative rounded-lg border-2 p-4 transition-all hover:shadow-lg cursor-pointer',
        isShieldMode ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white',
        'hover:scale-[1.02]'
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Shield Badge (top-right) */}
      {isShieldMode && (
        <div className="absolute top-2 right-2">
          <ShieldBadge mode={call.mode} priority={call.priority} />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {/* Intent Icon */}
        <div className="text-2xl flex-shrink-0 mt-1">
          {intentIcon}
        </div>

        {/* Call Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {call.customerName || 'Onbekend'}
          </h3>

          {/* Shield Mode Details */}
          {isShieldMode && call.companyName && (
            <p className="text-sm text-red-700 font-medium">
              🏢 {call.companyName}
            </p>
          )}

          {call.phoneNumber && (
            <p className="text-sm text-gray-600">
              📞 {call.phoneNumber}
            </p>
          )}
        </div>

        {/* Priority Badge */}
        <div>
          <span className={cn(
            'px-2 py-1 rounded-full text-xs font-bold uppercase',
            priorityColor
          )}>
            {call.priority || 'N/A'}
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-3">
        <p className={cn(
          'text-sm',
          isShieldMode ? 'text-gray-800 font-medium' : 'text-gray-700'
        )}>
          {call.summary || 'Geen samenvatting beschikbaar'}
        </p>
      </div>

      {/* Shield Mode: Invoice Number */}
      {isShieldMode && call.invoiceNumber && (
        <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded">
          <p className="text-sm text-red-900">
            <span className="font-semibold">Factuurnummer:</span> {call.invoiceNumber}
          </p>
        </div>
      )}

      {/* Transcript (Expanded) */}
      {isExpanded && call.transcript && (
        <div className="mt-3 p-3 bg-gray-100 rounded border border-gray-300">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            📜 Transcript:
          </h4>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {call.transcript}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
        <span>⏱️ {formatDuration(call.duration)}</span>
        <span>🕒 {relativeTime}</span>
        {call.appointment && (
          <span className="text-blue-600 font-semibold">📅 Afspraak</span>
        )}
      </div>

      {/* Expand Indicator */}
      <div className="text-center mt-2 text-xs text-gray-400">
        {isExpanded ? '▲ Klik om te sluiten' : '▼ Klik voor transcript'}
      </div>
    </div>
  );
}
