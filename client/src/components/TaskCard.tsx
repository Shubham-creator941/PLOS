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
    <Card className="hover:border-primary-500/50 hover:shadow-md transition-all cursor-pointer">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-50">{title}</h4>
          <Badge variant={statusConfig[status].variant}>{statusConfig[status].label}</Badge>
        </div>
        {description && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4">
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
