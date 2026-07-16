import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';

export const GoalSetup: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Goal Setup" description="Define your learning objectives." action={<Button>New Goal</Button>} />
      <EmptyState title="No goals yet" description="Start by setting a new learning goal for yourself." actionLabel="Create Goal" />
    </div>
  );
};
