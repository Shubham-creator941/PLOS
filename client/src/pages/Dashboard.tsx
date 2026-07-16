import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { TaskCard } from '../components/TaskCard';
import { Target, Zap, Clock } from 'lucide-react';

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Welcome back! Here's your learning overview." />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard title="Active Goals" value="3" icon={<Target />} trend={{ value: 12, isPositive: true }} />
        <StatCard title="Current Streak" value="7 days" icon={<Zap />} trend={{ value: 5, isPositive: true }} />
        <StatCard title="Study Hours" value="24h" icon={<Clock />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-50">Today's Tasks</h3>
          <TaskCard title="Read Chapter 4 of Clean Code" status="in_progress" dueDate="Today, 8:00 PM" />
          <TaskCard title="Complete React Quiz" status="pending" dueDate="Today, 10:00 PM" />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-50">Recent Activity</h3>
          <TaskCard title="Finished Advanced TypeScript Course" status="completed" description="Completed the final project." />
        </div>
      </div>
    </div>
  );
};
