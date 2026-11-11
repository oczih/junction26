import React from 'react';

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-lg bg-surface-2 animate-pulse border border-border-subtle/50 ${className}`}
    />
  );
}
