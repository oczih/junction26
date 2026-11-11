import React, { type ReactNode } from 'react';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-border-subtle bg-surface-1/40 ${className}`}
    >
      {icon ? (
        <div className="mb-3 text-text-muted">{icon}</div>
      ) : (
        <div className="mb-3 h-10 w-10 rounded-lg border border-border-subtle bg-surface-2 flex items-center justify-center text-text-muted">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
        </div>
      )}
      <h3 className="text-sm font-semibold text-text-primary tracking-tight">
        {title}
      </h3>
      <p className="mt-1 text-xs text-text-secondary max-w-sm leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
