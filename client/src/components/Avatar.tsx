import React from 'react';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ className = '', src, alt, initials, size = 'md', ...props }) => {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  return (
    <div
      className={`relative flex shrink-0 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {src ? (
        <img className="aspect-square h-full w-full object-cover" src={src} alt={alt || 'Avatar'} />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-medium text-neutral-600 dark:text-neutral-300">
          {initials}
        </span>
      )}
    </div>
  );
};
