import React from 'react';
import { EmptyState } from '@/primitives';
import { AlertOctagon } from 'lucide-react';

export const ErrorPage: React.FC = () => {
 return (
 <div className="flex min-h-screen items-center justify-center p-4">
 <EmptyState
 title="Something went wrong"
 description="An unexpected error occurred. Please try again later."
 icon={<AlertOctagon className="h-12 w-12 text-danger-500" />}
 actionLabel="Refresh Page"
 onAction={() => window.location.reload()}
 />
 </div>
 );
};
