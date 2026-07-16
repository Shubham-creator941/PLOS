import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { Textarea } from '../components/Textarea';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';

export const Reflection: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Daily Reflection" description="Take a moment to review what you learned." />
      <Card>
        <CardContent className="p-6 space-y-4">
          <Textarea label="What did you learn today?" placeholder="Write your thoughts..." />
          <Textarea label="What challenges did you face?" placeholder="Be honest with yourself..." />
          <Button>Save Reflection</Button>
        </CardContent>
      </Card>
    </div>
  );
};
