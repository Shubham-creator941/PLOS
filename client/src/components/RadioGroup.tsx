import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export const RadioGroup = React.forwardRef<HTMLInputElement, RadioGroupProps>(
  ({ className = '', options, name, value, onChange, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const isChecked = value === option.value;

          return (
            <div key={option.value} className="flex items-start gap-3">
              <div
                className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 ${
                  isChecked
                    ? 'border-primary-600 bg-primary-600 dark:border-primary-500 dark:bg-primary-500'
                    : 'border-neutral-300 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800'
                }`}
              >
                <input
                  ref={ref}
                  type="radio"
                  id={id}
                  name={name}
                  value={option.value}
                  checked={isChecked}
                  onChange={(e) => onChange?.(e.target.value)}
                  className={`absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0 ${className}`}
                  {...props}
                />
                {isChecked && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
              <div className="flex flex-col gap-0.5">
                <label htmlFor={id} className="cursor-pointer text-sm font-medium text-neutral-900 dark:text-neutral-50">
                  {option.label}
                </label>
                {option.description && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{option.description}</p>
                )}
              </div>
            </div>
          );
        })}
        {error && <p className="text-sm text-danger-500">{error}</p>}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
