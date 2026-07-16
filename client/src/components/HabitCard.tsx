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
    <Card className="transition-all hover:border-primary-500/50">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <h4 className="font-medium text-neutral-900 dark:text-neutral-50">{title}</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">🔥 {streak} day streak</p>
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
