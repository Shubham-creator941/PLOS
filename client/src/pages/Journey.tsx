import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { JourneyTimeline } from '../components/JourneyTimeline';

export const Journey: React.FC = () => {
  const timelineItems = [
    { id: '1', title: 'Started React Course', date: 'Jan 1, 2026', isCompleted: true },
    { id: '2', title: 'Completed basic hooks', date: 'Jan 5, 2026', isCompleted: true },
    { id: '3', title: 'Master Advanced Patterns', date: 'Feb 1, 2026', isCompleted: false },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="My Journey" description="Track your progress over time." />
      <div className="max-w-2xl bg-white p-6 rounded-xl border border-neutral-200 dark:bg-neutral-950 dark:border-neutral-800">
        <JourneyTimeline items={timelineItems} />
      </div>
    </div>
  );
};
