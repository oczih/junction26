'use client';

import React from 'react';
import { Button } from './button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  retry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'System Fault Detected',
  message,
  retry,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-10 px-4 text-center rounded-xl border border-red-900/40 bg-red-950/20 ${className}`}
    >
      <div className="mb-3 h-10 w-10 rounded-lg border border-red-800/50 bg-red-950/50 flex items-center justify-center text-red-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      <p className="mt-1 text-xs text-text-secondary max-w-sm leading-relaxed">
        {message}
      </p>
      {retry && (
        <div className="mt-4">
          <Button variant="secondary" size="sm" onClick={retry}>
            Retry Operation
          </Button>
        </div>
      )}
    </div>
  );
}
