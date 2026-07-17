import React from 'react';
import { PageHeader } from '../../widgets/PageHeader';
import { Card, CardContent } from '../../primitives/Card';
import { BookOpen, Layers } from 'lucide-react';

export const LibraryExperience: React.FC = () => {
 return (
 <div className="space-y-8 max-w-7xl mx-auto pb-24 pt-8 px-6 md:px-12">
 <PageHeader title="Library" description="Access your curated resources and active recall flashcards." />
 
 {/* Resource Grid Placeholder */}
 <section>
 <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
 <BookOpen className="w-5 h-5 text-primary" /> Resource Grid
 </h2>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {[1, 2, 3].map((i) => (
 <Card key={i} className="bg-surface border-border hover:border-primary-300 transition-colors cursor-pointer">
 <CardContent className="p-6">
 <div className="h-32 bg-surface-secondary rounded-md mb-4 flex items-center justify-center border border-border">
 <BookOpen className="w-8 h-8 text-text-muted opacity-50" />
 </div>
 <h3 className="font-semibold text-text-primary mb-1">Resource {i}</h3>
 <p className="text-sm text-text-muted">A short description of this learning resource will appear here.</p>
 </CardContent>
 </Card>
 ))}
 </div>
 </section>

 {/* Generated Concept Flashcards Placeholder */}
 <section className="pt-4">
 <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
 <Layers className="w-5 h-5 text-primary" /> Concept Flashcards
 </h2>
 <Card className="bg-surface-secondary border-none">
 <CardContent className="p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
 <Layers className="w-10 h-10 text-primary mb-4 opacity-50" />
 <h3 className="text-lg font-semibold text-text-primary mb-2">Active Recall Ready</h3>
 <p className="text-sm text-text-muted max-w-md mx-auto">
 Flashcards generated from your learning sessions will appear here for spaced repetition.
 </p>
 </CardContent>
 </Card>
 </section>
 </div>
 );
};
