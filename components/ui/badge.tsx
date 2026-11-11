import React, { type HTMLAttributes } from 'react';

export type BadgeVariant = 'brand' | 'neutral' | 'success' | 'warning' | 'error';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, { container: string; dot: string }> = {
  brand: {
    container: 'bg-umber/80 border-sienna/60 text-ember',
    dot: 'bg-ember',
  },
  neutral: {
    container: 'bg-surface-2 border-border-subtle text-text-secondary',
    dot: 'bg-text-muted',
  },
  success: {
    container: 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400',
    dot: 'bg-emerald-400',
  },
  warning: {
    container: 'bg-amber-950/40 border-amber-800/40 text-amber-300',
    dot: 'bg-amber-400',
  },
  error: {
    container: 'bg-red-950/40 border-red-800/40 text-red-400',
    dot: 'bg-red-400',
  },
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[11px] gap-1.5',
  md: 'px-2.5 py-1 text-xs gap-2',
};

export function Badge({
  variant = 'brand',
  size = 'sm',
  dot = false,
  className = '',
  children,
  ...props
}: BadgeProps) {
  const currentVariant = variantClasses[variant];

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded-full border whitespace-nowrap tracking-tight select-none ${currentVariant.container} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${currentVariant.dot}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
