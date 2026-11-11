import React, { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-text-secondary tracking-wide uppercase"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error || undefined}
          aria-describedby={
            error
              ? `${inputId}-error`
              : hint
                ? `${inputId}-hint`
                : undefined
          }
          className={`h-9 w-full rounded-lg border bg-surface-1 px-3 text-sm text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember/40 disabled:opacity-40 disabled:cursor-not-allowed ${
            error
              ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30'
              : 'border-border-subtle hover:border-sienna/40'
          } ${className}`}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-text-muted">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, rows = 3, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-medium text-text-secondary tracking-wide uppercase"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={!!error || undefined}
          className={`w-full rounded-lg border bg-surface-1 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-all focus:outline-none focus:border-ember focus:ring-1 focus:ring-ember/40 resize-none disabled:opacity-40 ${
            error
              ? 'border-red-600 focus:border-red-500 focus:ring-red-500/30'
              : 'border-border-subtle hover:border-sienna/40'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p className="text-xs text-text-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
