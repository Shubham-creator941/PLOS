import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, helperText, ...props }, ref) => {
    const id = props.id || props.name;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-label text-neutral-700 dark:text-neutral-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`flex min-h-[80px] w-full rounded-md border bg-white px-3 py-2 text-body text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-900 dark:text-neutral-50 dark:placeholder:text-neutral-400 ${
            error
              ? 'border-danger-500 focus:ring-danger-500'
              : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-700'
          } ${className}`}
          {...props}
        />
        {error && <p className="text-caption text-danger-500">{error}</p>}
        {helperText && !error && <p className="text-caption text-neutral-500">{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
