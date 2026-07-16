import React from 'react';
import { Card, CardContent } from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => {
  return (
    <Card className="hover:-translate-y-[2px] transition-all duration-normal ease-standard hover:shadow-md hover:border-border-hover bg-surface hover:bg-surface-hover">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-label text-neutral-500">{title}</p>
            <p className="mt-2 text-h2">{value}</p>
          </div>
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
              {icon}
            </div>
          )}
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <span
              className={`font-medium ${
                trend.isPositive ? 'text-accent-600 dark:text-accent-400' : 'text-danger-600 dark:text-danger-400'
              }`}
            >
              {trend.isPositive ? '+' : '-'}
              {trend.value}%
            </span>
            <span className="ml-2 text-neutral-500 dark:text-neutral-400">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
