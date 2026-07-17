import React from 'react';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
 ({ className = '', ...props }, ref) => (
 <div
 ref={ref}
 className={`rounded-2xl border border-border bg-surface ${className}`}
 {...props}
 />
 )
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
 ({ className = '', ...props }, ref) => (
 <div ref={ref} className={`flex flex-col space-y-1.5 p-6 md:p-8 ${className}`} {...props} />
 )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
 ({ className = '', ...props }, ref) => (
 <h3 ref={ref} className={`font-semibold tracking-tight text-text-primary ${className}`} {...props} />
 )
);
CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
 ({ className = '', ...props }, ref) => (
 <div ref={ref} className={`p-6 md:p-8 pt-0 md:pt-0 ${className}`} {...props} />
 )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
 ({ className = '', ...props }, ref) => (
 <div ref={ref} className={`flex items-center p-6 md:p-8 pt-0 md:pt-0 ${className}`} {...props} />
 )
);
CardFooter.displayName = 'CardFooter';
