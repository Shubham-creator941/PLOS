import React from 'react';
import { Loader } from '../components/Loader';

export const Loading: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <Loader size="lg" />
    </div>
  );
};
