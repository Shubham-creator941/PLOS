import React from 'react';
import { EmptyState } from '../components/EmptyState';

import { FileWarning } from 'lucide-react';

export const NotFound: React.FC = () => {
 return (
 <div className="flex min-h-screen items-center justify-center p-4">
 <EmptyState
 title="Page Not Found"
 description="The page you are looking for does not exist or has been moved."
 icon={<FileWarning className="h-12 w-12 text-warning-500" />}
 actionLabel="Go Home"
 onAction={() => window.location.href = '/'}
 />
 </div>
 );
};
