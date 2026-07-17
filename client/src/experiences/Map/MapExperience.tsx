import React, { useState } from 'react';
import { CheckCircle2, Clock, PlayCircle, BookOpen, MessageSquare, Target, Check, ChevronDown, ChevronUp, Brain } from 'lucide-react';
import { Card, CardContent } from '../../primitives/Card';
import { Button } from '../../primitives/Button';
import { ProgressRing } from '../../primitives/ProgressRing';
import { learningJourneyData } from '../../tests/mocks/learningJourney';

// ==========================================
// Sub-components
// ==========================================

const RoadmapOverview = ({ weeks }: { weeks: typeof learningJourneyData.weeks }) => (
 <div className="mb-12 overflow-x-auto pb-4 scrollbar-hide border-b border-border">
 <div className="max-w-7xl mx-auto px-6 md:px-12">
 <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-6">Learning Roadmap</h3>
 <div className="flex items-center min-w-max">
 {weeks.map((week, index) => (
 <React.Fragment key={week.id}>
 <div className="flex flex-col items-center w-16">
 <div className={`h-8 w-8 rounded-full flex items-center justify-center border transition-colors ${
 week.isCompleted ? 'bg-primary border-primary text-white' : week.isCurrent ? 'bg-surface-secondary border-primary text-primary shadow-sm' : 'bg-surface border-border text-text-muted'
 }`}>
 {week.isCompleted ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
 </div>
 <span className={`text-[11px] font-semibold uppercase tracking-wider mt-2 whitespace-nowrap ${week.isCurrent ? 'text-primary' : 'text-text-muted'}`}>
 Week {index + 1}
 </span>
 </div>
 <div className={`w-12 sm:w-20 h-px mx-2 ${
 week.isCompleted ? 'bg-primary' : 'bg-border'
 }`} />
 </React.Fragment>
 ))}
 <div className="flex flex-col items-center w-16">
 <div className="h-8 w-8 rounded-full flex items-center justify-center border border-border bg-surface text-text-muted">
 <Target className="w-4 h-4" />
 </div>
 <span className="text-[11px] font-semibold uppercase tracking-wider mt-2 text-text-muted whitespace-nowrap">Final Goal</span>
 </div>
 </div>
 </div>
 </div>
);

const HabitTracker = ({ habits }: { habits: typeof learningJourneyData.habits }) => {
 return (
 <Card>
 <div className="p-6 md:p-8 border-b border-border">
 <h3 className="font-semibold text-text-primary flex items-center gap-2">
 <CheckCircle2 className="w-5 h-5 text-primary" /> Habit Tracker
 </h3>
 </div>
 <CardContent className="p-6 md:p-8 space-y-8">
 <div className="flex items-center gap-6">
 <ProgressRing value={habits.dailyLearning.progress} size={64} strokeWidth={6} />
 <div>
 <div className="font-semibold text-text-primary mb-1">{habits.dailyLearning.label}</div>
 <div className="text-sm font-medium text-text-muted">{habits.dailyLearning.streak} Day Streak</div>
 </div>
 </div>
 <div className="flex items-center gap-6">
 <ProgressRing value={habits.weeklyReflection.progress} size={64} strokeWidth={6} />
 <div>
 <div className="font-semibold text-text-primary mb-1">{habits.weeklyReflection.label}</div>
 <div className="text-sm font-medium text-text-muted">{habits.weeklyReflection.streak}/{habits.weeklyReflection.maxStreak} Weeks</div>
 </div>
 </div>
 <div className="flex items-center gap-6">
 <ProgressRing value={habits.teachBack.progress} size={64} strokeWidth={6} />
 <div>
 <div className="font-semibold text-text-primary mb-1">{habits.teachBack.label}</div>
 <div className="text-sm font-medium text-text-muted">{habits.teachBack.streak}/{habits.teachBack.maxStreak} Sessions</div>
 </div>
 </div>
 </CardContent>
 </Card>
 );
};

const WeekCard = ({ week }: { week: typeof learningJourneyData.weeks[0] }) => {
 const [isExpanded, setIsExpanded] = useState(week.isCurrent || false);

 return (
 <div className="relative pl-8 pb-10 group">
 {/* Timeline connector and dot */}
 <div className="absolute left-0 top-5 bottom-0 w-px bg-border group-last:bg-transparent"></div>
 <div className={`absolute -left-[5px] top-4 h-3 w-3 rounded-full border-2 bg-surface z-10 ${
 week.isCompleted ? 'border-primary bg-primary' : week.isCurrent
 ? 'border-primary ring-4 ring-primary/20'
 : 'border-border'
 }`}></div>

 <Card className={`transition-all duration-300 ${isExpanded ? 'shadow-sm border-primary/30' : 'hover:border-border-hover'}`}>
 <div className="p-6 md:p-8 flex items-center justify-between cursor-pointer"
 onClick={() => setIsExpanded(!isExpanded)}
 >
 <div>
 <div className="flex items-center gap-3 mb-2">
 <span className="text-xs font-bold tracking-widest uppercase text-primary">{week.title}</span>
 {week.isCurrent && <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded">Current</span>}
 {week.isCompleted && <span className="text-[10px] font-bold uppercase tracking-wider bg-success/10 text-success px-2 py-0.5 rounded">Done</span>}
 </div>
 <h4 className="text-xl font-bold text-text-primary">{week.milestone}</h4>
 </div>
 <button className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-secondary transition-colors">
 {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
 </button>
 </div>

 {isExpanded && (
 <div className="px-6 md:px-8 pb-8 pt-2 border-t border-border animate-[fade-in_0.3s_ease-out]">
 <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-text-secondary font-medium">
 <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {week.estimatedHours} Hours</span>
 <span className="text-border">•</span>
 <span className="flex items-center gap-1.5">
 {week.cognitiveWorkload === 'Light' ? '🟢' : week.cognitiveWorkload === 'Moderate' ? '🟡' : '🔴'} {week.cognitiveWorkload} Workload
 </span>
 </div>
 <div className="space-y-6">
 <div>
 <h5 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
 <BookOpen className="w-4 h-4" /> Daily Tasks
 </h5>
 <ul className="space-y-3">
 {week.tasks.map((task, idx) => (
 <li key={idx} className="flex items-start gap-3 text-sm font-medium text-text-secondary">
 <Check className={`w-4 h-4 mt-0.5 shrink-0 ${week.isCompleted ? 'text-success' : 'text-border-hover'}`} />
 {task}
 </li>
 ))}
 </ul>
 </div>
 
 <div className="bg-surface-secondary rounded-xl p-5 border border-border">
 <h5 className="text-xs font-bold uppercase tracking-widest text-text-primary mb-2 flex items-center gap-2">
 <MessageSquare className="w-4 h-4 text-primary" /> Teach Back Activity
 </h5>
 <p className="text-sm font-medium text-text-secondary">{week.teachBackActivity}</p>
 </div>

 <div className="bg-surface rounded-xl p-5 border border-border">
 <h5 className="text-xs font-bold uppercase tracking-widest text-text-primary mb-2 flex items-center gap-2">
 <Brain className="w-4 h-4 text-text-muted" /> Reflection Prompt
 </h5>
 <p className="text-sm text-text-secondary italic">"{week.reflectionPrompt}"</p>
 </div>
 </div>
 </div>
 )}
 </Card>
 </div>
 );
};

// ==========================================
// Main Page Component
// ==========================================

export const Journey: React.FC = () => {
 const data = learningJourneyData;

 return (
 <div className="min-h-screen bg-background pb-20">
 
 {/* Header Section */}
 <div className="bg-surface border-b border-border pt-12 pb-12 mb-10">
 <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
 <div>
 <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-3">Your Learning System</h1>
 <div className="flex flex-wrap items-center gap-3">
 <h2 className="text-lg font-medium text-text-secondary">{data.header.goal}</h2>
 <span className="text-[10px] font-bold uppercase tracking-wider bg-success/10 text-success px-2 py-0.5 rounded">{data.header.status}</span>
 </div>
 </div>
 <div className="flex items-center gap-6">
 <div className="text-right">
 <div className="text-sm font-medium text-text-secondary mb-1">Overall Progress</div>
 <div className="text-xs text-text-muted">Est. {data.header.estimatedCompletion}</div>
 </div>
 <ProgressRing value={data.header.progress} size={80} strokeWidth={6} />
 </div>
 </div>
 </div>

 {/* Roadmap Overview */}
 <RoadmapOverview weeks={data.weeks} />

 {/* Main Two-Column Layout */}
 <div className="max-w-7xl mx-auto px-6 md:px-12">
 <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16">
 
 {/* Left Column: Deep Learning Path */}
 <div className="space-y-12">
 
 {/* SECTION 1: WHY */}
 <section>
 <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Why This Matters</h3>
 <Card className="border-l-4 border-l-primary">
 <CardContent className="p-8">
 <p className="text-xl font-medium text-text-primary leading-relaxed italic">
 "{data.why}"
 </p>
 </CardContent>
 </Card>
 </section>

 {/* SECTION 2 & 3: Identity & Success */}
 <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Identity</h3>
 <Card className="h-full">
 <CardContent className="p-8 h-full flex items-center">
 <p className="text-lg font-medium text-text-primary leading-relaxed">{data.identity}</p>
 </CardContent>
 </Card>
 </div>
 <div>
 <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">Success Looks Like</h3>
 <Card className="h-full">
 <CardContent className="p-8 h-full flex items-center">
 <p className="text-lg font-medium text-text-secondary leading-relaxed">{data.successDefinition}</p>
 </CardContent>
 </Card>
 </div>
 </section>

 {/* SECTION 4: System Principles */}
 <section>
 <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-4">System Principles</h3>
 <Card>
 <CardContent className="p-8">
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
 {data.systemPrinciples.map((principle, idx) => (
 <div key={idx} className="flex items-start gap-3">
 <div className="flex h-6 w-6 mt-0.5 items-center justify-center rounded-full bg-success/10 text-success shrink-0">
 <CheckCircle2 className="w-4 h-4" />
 </div>
 <span className="font-medium text-sm text-text-secondary leading-relaxed">{principle}</span>
 </div>
 ))}
 </div>
 </CardContent>
 </Card>
 </section>

 {/* SECTION 5: Weekly Learning Journey */}
 <section className="pt-8">
 <h3 className="text-2xl font-bold tracking-tight text-text-primary mb-8">Weekly Learning Journey</h3>
 <div className="ml-2">
 {data.weeks.map(week => (
 <WeekCard key={week.id} week={week} />
 ))}
 </div>
 </section>

 </div>

 {/* Right Column: Sticky Sidebar (Desktop) */}
 <div className="space-y-8">
 <div className="sticky top-10 space-y-8">
 <HabitTracker habits={data.habits} />
 
 <Card className="bg-surface-secondary border-none">
 <CardContent className="p-8">
 <h3 className="font-semibold text-text-primary flex items-center gap-2 mb-4">
 <Target className="w-5 h-5 text-primary" /> Today's Mission
 </h3>
 <h4 className="text-lg font-bold text-text-primary mb-4">{data.todaysMission.title}</h4>
 <div className="space-y-3">
 <Button className="w-full" size="lg">
 <PlayCircle className="w-4 h-4 mr-2" /> Start Session
 </Button>
 </div>
 </CardContent>
 </Card>
 </div>
 </div>

 </div>
 </div>
 </div>
 );
};
