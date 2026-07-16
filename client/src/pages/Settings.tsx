import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card, CardContent } from '../components/Card';
import { Button } from '../components/Button';

export const Settings: React.FC = () => {
 return (
 <div className="space-y-6">
 <PageHeader title="Settings" description="Manage your account and preferences." />
 <Card>
 <CardContent className="p-6 space-y-4">
 <div className="flex items-center justify-between border-b border-border pb-4 ">
 <div>
 <h3 className="font-medium text-text-primary ">Dark Mode</h3>
 <p className="text-sm text-text-muted ">Toggle dark mode appearance.</p>
 </div>
 <Button variant="outline">Toggle</Button>
 </div>
 <div className="flex items-center justify-between border-b border-border pb-4 ">
 <div>
 <h3 className="font-medium text-text-primary ">Notifications</h3>
 <p className="text-sm text-text-muted ">Manage email notifications.</p>
 </div>
 <Button variant="outline">Manage</Button>
 </div>
 </CardContent>
 </Card>
 </div>
 );
};
