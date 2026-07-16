import React from 'react';
import { FileQuestion } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
 title: string;
 description: string;
 actionLabel?: string;
 onAction?: () => void;
 icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
 title,
 description,
 actionLabel,
 onAction,
 icon = <FileQuestion className="h-12 w-12 text-text-muted" />,
}) => {
 return (
 <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-secondary p-8 text-center">
 <div className="mb-4">{icon}</div>
 <h3 className="mb-2 text-title">{title}</h3>
 <p className="mb-6 max-w-sm text-body text-text-muted">{description}</p>
 {actionLabel && onAction && (
 <Button onClick={onAction}>{actionLabel}</Button>
 )}
 </div>
 );
};
