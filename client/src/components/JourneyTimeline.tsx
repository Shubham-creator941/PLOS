import React from 'react';

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  description?: string;
  isCompleted?: boolean;
}

interface JourneyTimelineProps {
  items: TimelineItem[];
}

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ items }) => {
  return (
    <div className="relative border-l border-border ml-3 py-2">
      {items.map((item) => (
        <div key={item.id} className="mb-8 ml-6 last:mb-0">
          <span className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-surface ${
            item.isCompleted 
              ? 'bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400' 
              : 'bg-surface-secondary text-neutral-500'
          }`}>
            <div className={`h-2.5 w-2.5 rounded-full ${item.isCompleted ? 'bg-accent-600 dark:bg-accent-400' : 'bg-neutral-400'}`} />
          </span>
          <h3 className="mb-1 text-title">{item.title}</h3>
          <time className="mb-2 block text-caption leading-none text-neutral-400">
            {item.date}
          </time>
          {item.description && (
            <p className="text-body text-neutral-500">
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
