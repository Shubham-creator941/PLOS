import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({ className = '', variant = 'primary', children, ...props }) => {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
    secondary: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300',
    success: 'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300',
    warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300',
    danger: 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300',
    neutral: 'bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300',
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};
