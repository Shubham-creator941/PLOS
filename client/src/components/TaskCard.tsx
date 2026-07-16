import React from 'react';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';

interface TaskCardProps {
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ title, description, status, dueDate }) => {
  const statusConfig = {
    pending: { label: 'Pending', variant: 'neutral' as const },
    in_progress: { label: 'In Progress', variant: 'primary' as const },
    completed: { label: 'Completed', variant: 'success' as const },
  };

  return (
    <Card className="hover:-translate-y-[2px] transition-all duration-normal ease-standard hover:shadow-md hover:border-border-hover cursor-pointer bg-surface hover:bg-surface-hover">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-title">{title}</h4>
          <Badge variant={statusConfig[status].variant}>{statusConfig[status].label}</Badge>
        </div>
        {description && (
          <p className="text-body text-neutral-500 line-clamp-2 mb-4">
            {description}
          </p>
        )}
        {dueDate && (
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-auto">
            Due: {dueDate}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
