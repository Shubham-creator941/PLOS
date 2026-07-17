import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
 return (
 <div className="flex min-h-screen items-center justify-center bg-background p-4 ">
 <div className="w-full max-w-md">
 <div className="mb-8 text-center">
 <h1 className="text-3xl font-bold text-primary-600 ">PLOS</h1>
 <p className="mt-2 text-sm text-text-muted ">Personal Learning Operating System</p>
 </div>
 <Outlet />
 </div>
 </div>
 );
};
