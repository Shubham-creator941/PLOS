import React from 'react';
import { PageHeader } from '@/widgets';
import { Card, CardContent, CardHeader, CardTitle } from '@/primitives';
import { Button } from '@/primitives';
import { User, Palette, Link as LinkIcon } from 'lucide-react';

export const Settings: React.FC = () => {
 return (
 <div className="space-y-6 max-w-4xl mx-auto pb-24 pt-8">
 <PageHeader title="Engine Room" description="Configure your workspace and integrations." />
 
 {/* Profile Section */}
 <section>
 <Card>
 <CardHeader className="pb-3 border-b border-border">
 <CardTitle className="text-lg flex items-center gap-2">
 <User className="w-5 h-5 text-primary" /> Profile
 </CardTitle>
 </CardHeader>
 <CardContent className="p-6">
 <div className="flex items-center justify-between">
 <div>
 <h3 className="font-medium text-text-primary">Account Details</h3>
 <p className="text-sm text-text-muted">Manage your personal information.</p>
 </div>
 <Button variant="outline">Edit Profile</Button>
 </div>
 </CardContent>
 </Card>
 </section>

 {/* UI Preferences Section */}
 <section>
 <Card>
 <CardHeader className="pb-3 border-b border-border">
 <CardTitle className="text-lg flex items-center gap-2">
 <Palette className="w-5 h-5 text-primary" /> UI Preferences
 </CardTitle>
 </CardHeader>
 <CardContent className="p-6">
 <div className="flex items-center justify-between">
 <div>
 <h3 className="font-medium text-text-primary">Dark Mode</h3>
 <p className="text-sm text-text-muted">Toggle application theme appearance.</p>
 </div>
 <Button variant="outline">Toggle Theme</Button>
 </div>
 </CardContent>
 </Card>
 </section>

 {/* Integrations Section */}
 <section>
 <Card>
 <CardHeader className="pb-3 border-b border-border">
 <CardTitle className="text-lg flex items-center gap-2">
 <LinkIcon className="w-5 h-5 text-primary" /> Integrations
 </CardTitle>
 </CardHeader>
 <CardContent className="p-6">
 <div className="flex items-center justify-between">
 <div>
 <h3 className="font-medium text-text-primary">Connect Services</h3>
 <p className="text-sm text-text-muted">Link your calendar and external tools.</p>
 </div>
 <Button variant="outline">Manage Integrations</Button>
 </div>
 </CardContent>
 </Card>
 </section>
 </div>
 );
};
