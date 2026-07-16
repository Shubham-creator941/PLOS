import React from 'react';
import { Card, CardContent } from './Card';

interface ReasonCardProps {
  reason: string;
}

export const ReasonCard: React.FC<ReasonCardProps> = ({ reason }) => {
  return (
    <Card className="border-l-4 border-l-primary-500">
      <CardContent className="p-5">
        <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">My "Why"</h3>
        <p className="text-lg font-medium text-neutral-900 dark:text-neutral-50 italic">
          "{reason}"
        </p>
      </CardContent>
    </Card>
  );
};
