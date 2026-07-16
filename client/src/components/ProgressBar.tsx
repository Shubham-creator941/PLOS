import React from 'react';

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ className = '', value, max = 100, showLabel = false, ...props }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full ${className}`} {...props}>
      {showLabel && (
        <div className="mb-1.5 flex justify-between text-label text-neutral-700 dark:text-neutral-300">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        <div
          className="h-full bg-primary-600 transition-all duration-300 ease-in-out dark:bg-primary-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
