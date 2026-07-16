import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
 variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({ className = '', variant = 'primary', children, ...props }) => {
 const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-label transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
 const variants = {
 primary: 'bg-primary-100 text-primary-800 ',
 secondary: 'bg-surface-hover text-text-primary ',
 success: 'bg-accent-100 text-accent-800 ',
 warning: 'bg-warning-100 text-warning-800 ',
 danger: 'bg-danger-100 text-danger-800 ',
 neutral: 'bg-surface-active text-text-primary ',
 };

 const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

 return (
 <div className={combinedClasses} {...props}>
 {children}
 </div>
 );
};
