'use client';

import React, { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children' | 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-ember text-canvas font-semibold shadow-sm hover:bg-sienna focus-visible:ring-ember/60 transition-colors',
  secondary:
    'bg-surface-2 border border-border-subtle text-text-primary hover:border-sienna/50 hover:bg-surface-2/80 focus-visible:ring-ember/40 transition-colors',
  outline:
    'bg-transparent border border-sienna/50 text-text-primary hover:bg-umber/30 hover:border-ember/70 focus-visible:ring-ember/40 transition-colors',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-2 focus-visible:ring-ember/40 transition-colors',
  danger:
    'bg-red-950/60 border border-red-800/60 text-red-300 hover:bg-red-900/60 focus-visible:ring-red-500/40 transition-colors',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-md tracking-tight',
  md: 'h-9 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-11 px-6 text-sm font-medium gap-2.5 rounded-lg',
};

function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <circle
        className="opacity-20"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3.5"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        whileHover={isDisabled ? undefined : { scale: 1.01 }}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
        className={`inline-flex items-center justify-center select-none font-medium outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-canvas disabled:opacity-40 disabled:pointer-events-none cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
