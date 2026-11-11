import React, { type HTMLAttributes } from 'react';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'highlight' | 'muted';
};

export function Card({
  variant = 'default',
  className = '',
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-surface-1 border-border-subtle',
    highlight: 'bg-surface-1 border-sienna/40 shadow-[0_0_24px_rgba(72,30,20,0.25)]',
    muted: 'bg-surface-2/60 border-border-subtle',
  };

  return (
    <div
      className={`rounded-xl border transition-colors ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = '',
  children,
  strip = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { strip?: boolean }) {
  return (
    <div
      className={`px-5 py-4 flex flex-col gap-1 ${
        strip ? 'border-b border-border-subtle bg-surface-2/40 rounded-t-xl' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-sm font-semibold text-text-primary tracking-tight leading-snug ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={`text-xs text-text-secondary leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`px-5 py-3.5 border-t border-border-subtle/80 flex items-center justify-between text-xs text-text-muted ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
