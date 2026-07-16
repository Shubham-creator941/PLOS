import React from 'react';
import { Card, CardContent } from './Card';
import { Check } from 'lucide-react';

interface HabitCardProps {
  title: string;
  streak: number;
  isCompletedToday: boolean;
  onToggle?: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ title, streak, isCompletedToday, onToggle }) => {
  return (
    <Card className="hover:-translate-y-[2px] transition-all duration-normal ease-standard hover:shadow-md hover:border-border-hover cursor-pointer bg-surface hover:bg-surface-hover">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <h4 className="text-title">{title}</h4>
          <p className="text-body text-neutral-500 mt-1">🔥 {streak} day streak</p>
        </div>
        <button
          onClick={onToggle}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            isCompletedToday
              ? 'bg-accent-500 text-white hover:bg-accent-600'
              : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700'
          }`}
        >
          <Check className="h-4 w-4" />
        </button>
      </CardContent>
    </Card>
  );
};
