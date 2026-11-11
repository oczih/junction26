import React, { type ElementType, type HTMLAttributes } from 'react';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export function Container({
  as: Component = 'div',
  className = '',
  children,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Section({
  as: Component = 'section',
  className = '',
  children,
  ...props
}: ContainerProps) {
  return (
    <Component className={`py-6 sm:py-8 ${className}`} {...props}>
      {children}
    </Component>
  );
}
