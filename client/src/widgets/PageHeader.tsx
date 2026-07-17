import React from 'react';

interface PageHeaderProps {
 title: string;
 description?: string;
 action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, action }) => {
 return (
 <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
 <div>
 <h1 className="text-display tracking-tight text-text-primary ">
 {title}
 </h1>
 {description && (
 <p className="mt-1 text-body text-text-muted ">
 {description}
 </p>
 )}
 </div>
 {action && <div>{action}</div>}
 </div>
 );
};
