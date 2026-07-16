import React from 'react';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
 src?: string;
 alt?: string;
 initials?: string;
 size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ className = '', src, alt, initials, size = 'md', ...props }) => {
 const sizeClasses = {
 sm: 'h-8 w-8 text-label',
 md: 'h-10 w-10 text-caption',
 lg: 'h-12 w-12 text-body',
 };

 return (
 <div
 className={`relative flex shrink-0 overflow-hidden rounded-full bg-surface-active ${sizeClasses[size]} ${className}`}
 {...props}
 >
 {src ? (
 <img className="aspect-square h-full w-full object-cover" src={src} alt={alt || 'Avatar'} />
 ) : (
 <span className="flex h-full w-full items-center justify-center text-text-secondary ">
 {initials}
 </span>
 )}
 </div>
 );
};
