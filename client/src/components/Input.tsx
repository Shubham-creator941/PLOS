import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, ...props }, ref) => {
    const id = props.id || props.name;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-label text-neutral-700 dark:text-neutral-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`flex h-10 w-full rounded-md border bg-surface-secondary px-3 py-2 text-body text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-neutral-50 transition-colors ${
            error
              ? 'border-danger focus:border-danger focus:ring-danger/50'
              : 'border-border focus:border-primary focus:ring-primary/50'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-caption text-danger-500">{error}</p>}
        {helperText && !error && <p className="text-caption text-neutral-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
