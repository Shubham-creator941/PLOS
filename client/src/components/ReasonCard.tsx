import React from 'react';
import { Card, CardContent } from './Card';

interface ReasonCardProps {
  reason: string;
}

export const ReasonCard: React.FC<ReasonCardProps> = ({ reason }) => {
  return (
    <Card className="hover:-translate-y-[2px] transition-all duration-normal ease-standard hover:shadow-md hover:border-border-hover border-l-4 border-l-primary bg-surface hover:bg-surface-hover">
      <CardContent className="p-6">
        <h3 className="text-label text-neutral-500 mb-2">My "Why"</h3>
        <p className="text-body-large italic">
          "{reason}"
        </p>
      </CardContent>
    </Card>
  );
};
