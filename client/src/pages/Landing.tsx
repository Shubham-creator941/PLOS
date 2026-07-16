import React from 'react';

import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

export const Landing: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
      <div className="max-w-3xl text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
          Welcome to <span className="text-primary-600 dark:text-primary-500">PLOS</span>
        </h1>
        <p className="mb-8 text-lg text-neutral-600 dark:text-neutral-400">
          Your Personal Learning Operating System. Act as a tutor and accountability partner.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/login">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
