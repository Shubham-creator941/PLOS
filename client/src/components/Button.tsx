import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md transition-all duration-normal ease-standard active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-primary text-white hover:opacity-90 shadow-sm',
      secondary: 'bg-surface-secondary text-text-primary hover:bg-surface-active border border-border shadow-sm',
      outline: 'border border-border bg-transparent hover:bg-surface-active text-text-primary',
      ghost: 'bg-transparent hover:bg-surface-active text-text-primary',
      danger: 'bg-danger text-white hover:opacity-90 shadow-sm',
    };

    const sizes = {
      sm: 'h-8 px-3 text-label',
      md: 'h-10 px-4 py-2 text-body',
      lg: 'h-12 px-8 text-body-large',
    };

    const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <button ref={ref} className={combinedClasses} disabled={disabled || isLoading} {...props}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
