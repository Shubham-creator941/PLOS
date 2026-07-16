import React from 'react';
import { Card, CardContent } from './Card';
import { ProgressBar } from './ProgressBar';

interface MilestoneCardProps {
  title: string;
  targetDate: string;
  progress: number;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ title, targetDate, progress }) => {
  return (
    <Card>
      <CardContent className="p-5">
        <h4 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-1">{title}</h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">Target: {targetDate}</p>
        <ProgressBar value={progress} showLabel />
      </CardContent>
    </Card>
  );
};
