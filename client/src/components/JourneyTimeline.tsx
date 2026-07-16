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
    <div className="relative border-l border-neutral-200 dark:border-neutral-800 ml-3 py-2">
      {items.map((item) => (
        <div key={item.id} className="mb-8 ml-6 last:mb-0">
          <span className={`absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white dark:ring-neutral-950 ${
            item.isCompleted 
              ? 'bg-accent-100 text-accent-600 dark:bg-accent-900/30 dark:text-accent-400' 
              : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
          }`}>
            <div className={`h-2.5 w-2.5 rounded-full ${item.isCompleted ? 'bg-accent-600 dark:bg-accent-400' : 'bg-neutral-400 dark:bg-neutral-500'}`} />
          </span>
          <h3 className="mb-1 text-base font-semibold text-neutral-900 dark:text-neutral-50">{item.title}</h3>
          <time className="mb-2 block text-sm font-normal leading-none text-neutral-400 dark:text-neutral-500">
            {item.date}
          </time>
          {item.description && (
            <p className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
              {item.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
