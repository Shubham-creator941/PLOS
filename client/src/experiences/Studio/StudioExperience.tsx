import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Circle, Clock, Target, BookOpen, ChevronRight, FileText, Video, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/primitives';
import { Badge } from '@/primitives';
import { Button } from '@/primitives';
import { sessionData } from '../../tests/mocks/session';

// ==========================================
// Sub-components
// ==========================================

const FocusTimer = () => {
 const [timeLeft, setTimeLeft] = useState(25 * 60);
 const [isRunning, setIsRunning] = useState(false);

 useEffect(() => {
 let interval: ReturnType<typeof setInterval>;
 if (isRunning && timeLeft > 0) {
 interval = setInterval(() => {
 setTimeLeft((prev) => prev - 1);
 }, 1000);
 } else if (timeLeft === 0) {
 setIsRunning(false);
 }
 return () => clearInterval(interval);
 }, [isRunning, timeLeft]);

 const toggleTimer = () => setIsRunning(!isRunning);
 const resetTimer = () => {
 setIsRunning(false);
 setTimeLeft(25 * 60);
 };

 const minutes = Math.floor(timeLeft / 60);
 const seconds = timeLeft % 60;
 const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

 return (
 <Card className="bg-primary-900 text-text-primary border-0 shadow-lg overflow-hidden relative">
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
 <Clock className="w-64 h-64" />
 </div>
 <CardContent className="p-8 md:p-12 flex flex-col items-center justify-center relative z-10 text-center">
 <p className="text-primary-200 text-sm font-semibold uppercase tracking-widest mb-4">Focus Session</p>
 <div className="text-7xl md:text-8xl font-black tracking-tighter tabular-nums mb-8">
 {timeString}
 </div>
 <div className="flex items-center gap-4">
 <Button variant={isRunning ? "secondary" : "primary"} size="lg" className={`w-40 rounded-full font-bold ${!isRunning ? 'bg-surface text-primary-900 hover:bg-surface-hover' : 'bg-primary-800 text-text-primary border-0 hover:bg-primary-700'}`}
 onClick={toggleTimer}
 >
 {isRunning ? <><Pause className="w-5 h-5 mr-2" /> Pause</> : <><Play className="w-5 h-5 mr-2" /> Focus</>}
 </Button>
 <button onClick={resetTimer} className="p-3 rounded-full text-primary-200 hover:text-text-primary hover:bg-primary-800 transition-colors"
 title="Reset Timer"
 >
 <RotateCcw className="w-5 h-5" />
 </button>
 </div>
 </CardContent>
 </Card>
 );
};

const Workspace = () => {
 const [checkedTasks, setCheckedTasks] = useState<number[]>([]);
 const toggleTask = (index: number) => {
 setCheckedTasks(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
 );
 };

 return (
 <Card>
 <CardHeader className="pb-4 border-b border-border ">
 <CardTitle className="text-lg flex items-center gap-2">
 <Target className="w-5 h-5 text-primary-500" /> Objectives
 </CardTitle>
 </CardHeader>
 <CardContent className="p-5 space-y-6">
 <div className="space-y-3">
 {sessionData.workspace.objectives.map((obj, i) => {
 const isChecked = checkedTasks.includes(i);
 return (
 <label key={i} className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
 isChecked ? 'bg-primary-50/50 border-primary-200 ' : 'bg-surface border-border hover:border-primary-300 '
 }`}>
 <div className="mt-0.5" onClick={() => toggleTask(i)}>
 {isChecked ? <CheckCircle2 className="w-5 h-5 text-primary-600 " /> : <Circle className="w-5 h-5 text-text-muted" />}
 </div>
 <span className={`text-sm font-medium ${isChecked ? 'text-text-muted line-through ' : 'text-text-primary '}`}>
 {obj}
 </span>
 </label>
 );
 })}
 </div>
 <div>
 <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
 <BookOpen className="w-4 h-4 text-text-muted" /> Resources
 </h4>
 <div className="flex flex-col gap-2">
 {sessionData.workspace.resources.map((res) => (
 <a key={res.id} href={res.url} className="flex items-center justify-between p-3 rounded-md bg-background hover:bg-surface-hover transition-colors group">
 <div className="flex items-center gap-3">
 {res.title.includes('Video') ? <Video className="w-4 h-4 text-accent-500" /> : <FileText className="w-4 h-4 text-primary-500" />}
 <span className="text-sm font-medium text-text-secondary group-hover:text-primary-600 ">{res.title}</span>
 </div>
 <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary-500" />
 </a>
 ))}
 </div>
 </div>

 <div>
 <h4 className="text-sm font-semibold text-text-primary mb-3">Workspace Notes</h4>
 <textarea className="w-full h-32 rounded-lg border border-border bg-surface p-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 "
 placeholder="Jot down rough notes, code snippets, or thoughts as you learn..."
 ></textarea>
 </div>
 </CardContent>
 </Card>
 );
};


// ==========================================
// Main Page Component
// ==========================================

 import { useLearningSessionQuery } from '@/hooks/queries/useStudioQueries';

export const TaskDetails: React.FC = () => {
 const { data: backendData, isLoading, isError } = useLearningSessionQuery();

 if (isLoading || !backendData) {
   return (
     <div className="min-h-screen bg-background pb-24 px-4 sm:px-6 lg:px-8">
       <Skeleton className="h-32 w-full max-w-4xl mx-auto my-8" />
       <Skeleton className="h-96 w-full max-w-4xl mx-auto my-8" />
     </div>
   );
 }

 if (isError) {
   return <div className="text-danger p-8">Failed to load session data.</div>;
 }

 const data = {
   ...sessionData,
   header: {
     ...sessionData.header,
     missionTitle: backendData.task.title,
     estimatedDuration: `${backendData.focusTimeTarget}m`
   },
   workspace: {
     ...sessionData.workspace,
     prompt: backendData.task.description,
     objectives: sessionData.workspace.objectives.map((obj, i) => i === 0 ? `Focus: ${backendData.task.type}` : obj)
   }
 };

 return (
 <div className="min-h-screen bg-background pb-24">
 {/* SECTION 1: Session Header */}
 <div className="bg-surface border-b border-border pt-8 pb-8 mb-8 sticky top-0 z-20 shadow-sm">
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <div className="flex items-center gap-3 mb-2">
 <Badge variant="primary">{data.header.currentWeek}</Badge>
 <span className="text-sm font-semibold uppercase tracking-wider text-text-muted">Today's Mission</span>
 </div>
 <h1 className="text-2xl sm:text-3xl font-bold text-text-primary ">{data.header.missionTitle}</h1>
 </div>
 <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-text-secondary ">
 <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-text-muted" /> {data.header.estimatedDuration}</span>
 <span className="w-px h-4 bg-neutral-300 hidden sm:block"></span>
 <span className="flex items-center gap-1.5">
 {data.header.difficulty === 'Easy' ? '🟢' : data.header.difficulty === 'Medium' ? '🟡' : '🔴'} {data.header.difficulty}
 </span>
 <span className="w-px h-4 bg-neutral-300 hidden sm:block"></span>
 <span className="flex items-center gap-1.5 text-success-600 ">
 🟢 {data.header.focusStatus}
 </span>
 </div>
 </div>
 </div>
 </div>

 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
 {/* SECTION 2: Focus Timer */}
 <section>
 <FocusTimer />
 </section>

 {/* SECTION 3: Learning Workspace */}
 <section>
 <h2 className="text-xl font-bold text-text-primary mb-4">Workspace</h2>
 <Workspace />
 </section>

 {/* Adaptive Nudge Placeholder */}
 <section>
 <Card className="bg-surface-secondary border-none">
 <CardContent className="p-6 flex items-start gap-4">
 <div className="bg-primary/10 text-primary p-2 rounded-full shrink-0">
 <MessageSquare className="w-5 h-5" />
 </div>
 <div>
 <h3 className="text-sm font-semibold text-text-primary mb-1">Adaptive Nudge</h3>
 <p className="text-sm text-text-secondary">
 Based on your previous performance, consider breaking this objective into smaller 10-minute intervals.
 </p>
 </div>
 </CardContent>
 </Card>
 </section>

 {/* SECTION 7: Session Summary CTA */}
 <section className="pt-8 text-center border-t border-border ">
 <Button size="lg" className="w-full sm:w-auto px-12 py-6 text-lg font-bold rounded-xl shadow-md">
 Finish Session
 </Button>
 <p className="text-sm text-text-muted mt-4">Your progress will be logged and your dashboard updated.</p>
 </section>

 </div>
 </div>
 );
};
