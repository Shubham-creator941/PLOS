import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'rectangular',
  ...props 
}) => {
  const baseClasses = 'animate-pulse bg-surface-hover/80';
  
  let variantClasses = '';
  switch (variant) {
    case 'text':
      variantClasses = 'h-4 w-3/4 rounded';
      break;
    case 'circular':
      variantClasses = 'rounded-full';
      break;
    case 'rectangular':
      variantClasses = 'rounded-md';
      break;
  }

  return (
    <div 
      className={`${baseClasses} ${variantClasses} ${className}`} 
      {...props} 
    />
  );
};
