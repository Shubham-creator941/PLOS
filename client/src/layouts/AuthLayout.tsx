import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4 dark:bg-neutral-950">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-500">PLOS</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Personal Learning Operating System</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
