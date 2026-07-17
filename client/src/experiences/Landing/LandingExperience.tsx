import React from 'react';

import { Button } from '@/primitives';
import { Link } from 'react-router-dom';

export const Landing: React.FC = () => {
 return (
 <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
 <div className="max-w-3xl text-center">
 <h1 className="mb-6 text-5xl font-bold tracking-tight text-text-primary ">
 Welcome to <span className="text-primary-600 ">PLOS</span>
 </h1>
 <p className="mb-8 text-lg text-text-secondary ">
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
