import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, description, ...props }, ref) => {
    const id = props.id || props.name || label.replace(/\s+/g, '-').toLowerCase();

    return (
      <div className="flex items-start gap-3">
        <div className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border bg-surface transition-colors focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2 hover:bg-surface-hover has-[:checked]:border-primary has-[:checked]:bg-primary">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            className={`absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0 ${className}`}
            {...props}
          />
          <Check className="pointer-events-none hidden h-3.5 w-3.5 text-white has-[:checked]:block" strokeWidth={3} />
        </div>
        <div className="flex flex-col gap-0.5">
          <label htmlFor={id} className="cursor-pointer text-label text-neutral-900 dark:text-neutral-50">
            {label}
          </label>
          {description && (
            <p className="text-caption text-neutral-500">{description}</p>
          )}
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
