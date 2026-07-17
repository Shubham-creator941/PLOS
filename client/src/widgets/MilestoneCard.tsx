import React from 'react';
import { Card, CardContent } from '../primitives/Card';
import { ProgressBar } from '../primitives/ProgressBar';

interface MilestoneCardProps {
 title: string;
 targetDate: string;
 progress: number;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({ title, targetDate, progress }) => {
 return (
 <Card className="hover:-translate-y-[2px] transition-all duration-normal ease-standard hover:shadow-md hover:border-border-hover bg-surface hover:bg-surface-hover">
 <CardContent className="p-6">
 <h4 className="text-title mb-1">{title}</h4>
 <p className="text-caption text-text-muted mb-4">Target: {targetDate}</p>
 <ProgressBar value={progress} showLabel />
 </CardContent>
 </Card>
 );
};
