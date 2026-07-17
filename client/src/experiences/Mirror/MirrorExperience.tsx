import React, { useState } from 'react';
import { PageHeader } from '@/widgets';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/primitives';
import { Badge } from '@/primitives';
import { Button } from '@/primitives';
import { MessageSquare, Check, Brain, Trophy } from 'lucide-react';
import { useAssessmentQuery, useSubmitAssessmentMutation } from '@/hooks/queries/useMirrorQueries';
import { sessionData } from '../../tests/mocks/session';

const TeachBack = ({ data }: { data: typeof sessionData }) => {
 const [text, setText] = useState('');
 const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
 return (
 <Card className="border-l-4 border-l-accent-500">
 <CardHeader className="pb-3 border-b border-border bg-background ">
 <div className="flex items-start justify-between">
 <div>
 <CardTitle className="text-lg flex items-center gap-2 text-text-primary ">
 <MessageSquare className="w-5 h-5 text-accent-500" /> Teach Back
 </CardTitle>
 <p className="text-sm text-text-secondary mt-1">{data.teachBack.prompt}</p>
 </div>
 <Badge variant="neutral" className="hidden sm:flex">{wordCount} Words</Badge>
 </div>
 </CardHeader>
 <CardContent className="p-5">
 <textarea className="w-full h-40 rounded-lg border border-border bg-surface p-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-500 "
 placeholder="Start explaining..."
 value={text}
 onChange={(e) => setText(e.target.value)}
 ></textarea>
 <div className="flex items-center justify-between mt-3">
 <p className="text-xs text-text-muted font-medium italic">{data.teachBack.helperText}</p>
 <span className="sm:hidden text-xs font-semibold text-text-muted">{wordCount} Words</span>
 {wordCount > 20 && (
 <span className="flex items-center gap-1 text-xs font-bold text-success-600 animate-[fade-in_0.3s_ease-in-out]">
 <Check className="w-3 h-3" /> Looking good!
 </span>
 )}
 </div>
 </CardContent>
 </Card>
 );
};

const ReflectionPrompt = ({ data }: { data: typeof sessionData }) => {
 const [confidence, setConfidence] = useState(5);
 const [difficulty, setDifficulty] = useState<string>('');

 return (
 <Card>
 <CardHeader className="pb-4 border-b border-border">
 <CardTitle className="text-lg flex items-center gap-2">
 <Brain className="w-5 h-5 text-primary-500" /> Session Reflection
 </CardTitle>
 </CardHeader>
 <CardContent className="p-6 space-y-8 mt-2">
 {data.reflection.questions.map((q, i) => (
 <div key={i}>
 <label className="block text-sm font-semibold text-text-primary mb-2">{q}</label>
 <textarea className="w-full h-24 rounded-lg border border-border bg-surface p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 "
 ></textarea>
 </div>
 ))}

 <div className="pt-4 border-t border-border ">
 <label className="block text-sm font-semibold text-text-primary mb-4">
 How confident do you feel now? ({confidence}/10)
 </label>
 <div className="flex items-center gap-4">
 <span className="text-xs font-bold text-text-muted">1</span>
 <input type="range" min="1" max="10" value={confidence} onChange={(e) => setConfidence(parseInt(e.target.value))}
 className="w-full h-2 bg-surface-active rounded-lg appearance-none cursor-pointer accent-primary-600"
 />
 <span className="text-xs font-bold text-text-muted">10</span>
 </div>
 </div>

 <div className="pt-4 border-t border-border ">
 <label className="block text-sm font-semibold text-text-primary mb-3">Overall Difficulty</label>
 <div className="flex gap-3">
 {data.reflection.difficultyOptions.map(opt => (
 <button
 key={opt}
 onClick={() => setDifficulty(opt)}
 className={`px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
 difficulty === opt ? 'bg-primary-50 border-primary-500 text-primary-700 ' : 'bg-surface border-border text-text-secondary hover:border-primary-300 '
 }`}
 >
 {opt}
 </button>
 ))}
 </div>
 </div>
 </CardContent>
 </Card>
 );
};

export const Reflection: React.FC = () => {
 const { data, isLoading, isError } = useAssessmentQuery();
 const submitMutation = useSubmitAssessmentMutation();

 if (isLoading || !data) {
   return (
     <div className="space-y-6 max-w-4xl mx-auto pb-24 pt-8">
       <PageHeader title="Mirror" description="Reflect on your learning and validate your understanding." />
       <Skeleton className="h-64 w-full" />
       <Skeleton className="h-96 w-full" />
     </div>
   );
 }

 if (isError) {
   return <div className="text-danger p-8">Failed to load reflection data.</div>;
 }

 const displayData = sessionData;

 const handleSubmit = () => {
   submitMutation.mutate({ id: data.id, answer: 'Submitted from UI' });
 };

 return (
 <div className="space-y-6 max-w-4xl mx-auto pb-24 pt-8">
 <PageHeader title="Mirror" description="Reflect on your learning and validate your understanding." />
 
 {/* Teach-back Assessment */}
 <section>
 <TeachBack data={displayData} />
 </section>

 {/* Reflection Prompt */}
 <section>
 <ReflectionPrompt data={displayData} />
 </section>

 {/* Previous Mastery Summary Placeholder */}
 <section>
 <Card className="bg-surface-secondary border-none">
 <CardContent className="p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
 <Trophy className="w-8 h-8 text-primary mb-3 opacity-50" />
 <h3 className="font-semibold text-text-primary mb-2">Previous Mastery Summary</h3>
 <p className="text-sm text-text-muted">Your past accomplishments and retained concepts will appear here.</p>
 </CardContent>
 </Card>
 </section>

 <div className="pt-8 flex justify-end">
 <Button size="lg" onClick={handleSubmit} disabled={submitMutation.isPending}>
   {submitMutation.isPending ? 'Saving...' : 'Save Reflection'}
 </Button>
 </div>
 </div>
 );
};
