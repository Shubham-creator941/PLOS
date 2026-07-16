import React from 'react';
import { Card, CardContent } from './Card';
import { Flame } from 'lucide-react';

interface StreakCardProps {
 currentStreak: number;
 longestStreak: number;
}

export const StreakCard: React.FC<StreakCardProps> = ({ currentStreak, longestStreak }) => {
 return (
 <Card className="hover:-translate-y-[2px] transition-all duration-normal ease-standard hover:shadow-md hover:border-border-hover bg-surface hover:bg-surface-hover">
 <CardContent className="p-6">
 <div className="flex items-center gap-4">
 <div className="flex h-14 w-14 items-center justify-center rounded-full bg-warning-500 text-text-primary shadow-sm">
 <Flame className="h-7 w-7" />
 </div>
 <div>
 <h3 className="text-label text-warning-800 ">Current Streak</h3>
 <div className="flex items-baseline gap-2 mt-1">
 <span className="text-h2 text-warning-900 ">{currentStreak}</span>
 <span className="text-body text-warning-700 ">days</span>
 </div>
 <p className="text-caption text-warning-600 mt-1">Longest: {longestStreak} days</p>
 </div>
 </div>
 </CardContent>
 </Card>
 );
};
