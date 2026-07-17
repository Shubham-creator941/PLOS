import React from 'react';
import { PageHeader } from '../../widgets/PageHeader';
import { MilestoneCard } from '../../widgets/MilestoneCard';

export const LearningPlan: React.FC = () => {
 return (
 <div className="space-y-6">
 <PageHeader title="Learning Plan" description="Your structured path to mastery." />
 <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
 <MilestoneCard title="Frontend Basics" targetDate="Feb 28, 2026" progress={100} />
 <MilestoneCard title="React Mastery" targetDate="April 15, 2026" progress={65} />
 <MilestoneCard title="Fullstack Integration" targetDate="June 1, 2026" progress={10} />
 </div>
 </div>
 );
};
