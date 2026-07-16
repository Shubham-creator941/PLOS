import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ className = '', size = 'md', fullScreen = false, ...props }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const loaderContent = (
    <div className={`flex flex-col items-center justify-center text-primary-600 ${className}`} {...props}>
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-neutral-950/80">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};
