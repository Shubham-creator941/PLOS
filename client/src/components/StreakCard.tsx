import React from 'react';
import { Card, CardContent } from './Card';
import { Flame } from 'lucide-react';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakCard: React.FC<StreakCardProps> = ({ currentStreak, longestStreak }) => {
  return (
    <Card className="bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-950/50 dark:to-warning-900/30 border-warning-200 dark:border-warning-800">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-warning-500 text-white shadow-sm">
            <Flame className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-warning-800 dark:text-warning-300">Current Streak</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-warning-900 dark:text-warning-100">{currentStreak}</span>
              <span className="text-sm text-warning-700 dark:text-warning-400">days</span>
            </div>
            <p className="text-xs text-warning-600 dark:text-warning-500 mt-1">Longest: {longestStreak} days</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
