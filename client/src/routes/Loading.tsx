import React from 'react';
import { Loader } from '@/primitives';

export const Loading: React.FC = () => {
 return (
 <div className="flex min-h-screen items-center justify-center bg-background ">
 <Loader size="lg" />
 </div>
 );
};
