import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';

export const TaskDetails: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Task Details" />
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">Read Chapter 4 of Clean Code</h2>
            <Badge variant="primary">In Progress</Badge>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400">
            Focus on the sections regarding naming conventions and function structure.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
