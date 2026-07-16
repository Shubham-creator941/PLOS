import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, PlayCircle, BookOpen, MessageSquare, Target, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { learningJourneyData } from '../mocks/learningJourney';

// ==========================================
// Sub-components
// ==========================================

const RoadmapOverview = ({ weeks }: { weeks: typeof learningJourneyData.weeks }) => (
 <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide border-b border-border ">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-6">Learning Roadmap</h3>
 <div className="flex items-center min-w-max">
 {weeks.map((week, index) => (
 <React.Fragment key={week.id}>
 <div className="flex flex-col items-center w-16">
 <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 mb-2 transition-colors ${
 week.isCompleted ? 'bg-primary-500 border-primary-500 text-text-primary' : week.isCurrent ? 'bg-primary-50 border-primary-500 text-primary-600 ' : 'bg-surface border-border text-text-muted'
 }`}>
 {week.isCompleted ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
 </div>
 <span className={`text-xs font-medium whitespace-nowrap ${week.isCurrent ? 'text-primary-600 ' : 'text-text-muted'}`}>
 Week {index + 1}
 </span>
 </div>
 <div className={`w-12 sm:w-20 h-0.5 mx-2 ${
 week.isCompleted ? 'bg-primary-500' : 'bg-surface-active '
 }`} />
 </React.Fragment>
 ))}
 <div className="flex flex-col items-center w-16">
 <div className="h-8 w-8 rounded-full flex items-center justify-center border-2 bg-surface border-border text-text-muted mb-2">
 <Target className="w-4 h-4" />
 </div>
 <span className="text-xs font-medium text-text-muted whitespace-nowrap">Final Goal</span>
 </div>
 </div>
 </div>
 </div>
);

const MotivationCard = () => {
 const [quoteIndex, setQuoteIndex] = useState(0);

 useEffect(() => {
 const interval = setInterval(() => {
 setQuoteIndex((prev) => (prev + 1) % learningJourneyData.motivationalQuotes.length);
 }, 8000);
 return () => clearInterval(interval);
 }, []);

 return (
 <Card className="bg-gradient-to-br from-primary-900 to-primary-800 text-text-primary border-0 shadow-lg relative overflow-hidden">
 <div className="absolute top-0 right-0 p-4 opacity-10">
 <Target className="w-24 h-24" />
 </div>
 <CardContent className="p-6 relative z-10 flex flex-col justify-center min-h-[140px]">
 <p className="text-lg font-medium italic animate-[fade-in_1s_ease-in-out]">
 "{learningJourneyData.motivationalQuotes[quoteIndex]}"
 </p>
 </CardContent>
 </Card>
 );
};

const HabitTracker = ({ habits }: { habits: typeof learningJourneyData.habits }) => {
 return (
 <Card>
 <div className="p-5 border-b border-border ">
 <h3 className="font-semibold text-text-primary flex items-center gap-2">
 <CheckCircle2 className="w-5 h-5 text-primary-500" /> Habit Tracker
 </h3>
 </div>
 <CardContent className="p-5 space-y-5">
 <div>
 <div className="flex justify-between text-sm mb-1.5">
 <span className="font-medium text-text-secondary ">{habits.dailyLearning.label}</span>
 <span className="text-text-muted">{habits.dailyLearning.streak} Day Streak</span>
 </div>
 <ProgressBar value={habits.dailyLearning.progress} />
 </div>
 <div>
 <div className="flex justify-between text-sm mb-1.5">
 <span className="font-medium text-text-secondary ">{habits.weeklyReflection.label}</span>
 <span className="text-text-muted">{habits.weeklyReflection.streak}/{habits.weeklyReflection.maxStreak} Weeks</span>
 </div>
 <ProgressBar value={habits.weeklyReflection.progress} />
 </div>
 <div>
 <div className="flex justify-between text-sm mb-1.5">
 <span className="font-medium text-text-secondary ">{habits.teachBack.label}</span>
 <span className="text-text-muted">{habits.teachBack.streak}/{habits.teachBack.maxStreak} Sessions</span>
 </div>
 <ProgressBar value={habits.teachBack.progress} />
 </div>
 <div>
 <div className="flex justify-between text-sm mb-1.5">
 <span className="font-medium text-text-secondary ">{habits.projectProgress.label}</span>
 <span className="text-text-muted">{habits.projectProgress.progress}%</span>
 </div>
 <ProgressBar value={habits.projectProgress.progress} />
 </div>
 </CardContent>
 </Card>
 );
};

const MissionCard = ({ mission }: { mission: typeof learningJourneyData.todaysMission }) => (
 <Card className="border-2 border-primary-200 shadow-md bg-surface ">
 <div className="p-5 border-b border-primary-100 bg-primary-50/50 ">
 <h3 className="font-bold text-lg text-text-primary flex items-center gap-2">
 <Target className="w-5 h-5 text-primary-600 " /> Today's Mission
 </h3>
 </div>
 <CardContent className="p-5">
 <h4 className="text-base font-semibold text-text-primary mb-4">{mission.title}</h4>
 <div className="flex flex-col gap-3 text-sm text-text-secondary mb-6 font-medium">
 <div className="flex items-center gap-2">⏱ {mission.estimatedTime}</div>
 <div className="flex items-center gap-2">
 {mission.difficulty === 'Easy' ? '🟢' : mission.difficulty === 'Medium' ? '🟡' : '🔴'} {mission.difficulty}
 </div>
 <div className="flex items-center gap-2">🟢 Focus Mode {mission.focusModeStatus}</div>
 </div>
 <div className="space-y-3">
 <Button className="w-full" size="lg">
 <PlayCircle className="w-4 h-4 mr-2" /> Start Learning Session
 </Button>
 <Button variant="outline" className="w-full">
 View Dashboard
 </Button>
 </div>
 </CardContent>
 </Card>
);

const WeekCard = ({ week }: { week: typeof learningJourneyData.weeks[0] }) => {
 const [isExpanded, setIsExpanded] = useState(week.isCurrent || false);

 return (
 <div className="relative pl-8 pb-8 group">
 {/* Timeline connector and dot */}
 <div className="absolute left-0 top-5 bottom-0 w-px bg-surface-active group-last:bg-transparent"></div>
 <div className={`absolute -left-1.5 top-1.5 h-3.5 w-3.5 rounded-full border-2 bg-surface z-10 ${
 week.isCompleted ? 'border-primary-500 bg-primary-500 ' : week.isCurrent
 ? 'border-primary-500 ring-4 ring-primary-50 '
 : 'border-border '
 }`}></div>

 <Card className={`transition-all duration-300 ${isExpanded ? 'shadow-md border-primary-200 ' : 'hover:border-border '}`}>
 <div className="p-5 flex items-center justify-between cursor-pointer"
 onClick={() => setIsExpanded(!isExpanded)}
 >
 <div>
 <div className="flex items-center gap-3 mb-1">
 <span className="text-sm font-semibold text-primary-600 ">{week.title}</span>
 {week.isCurrent && <Badge variant="primary">Current Week</Badge>}
 {week.isCompleted && <Badge variant="success">Completed</Badge>}
 </div>
 <h4 className="text-lg font-bold text-text-primary ">{week.milestone}</h4>
 </div>
 <button className="p-2 text-text-muted hover:text-text-secondary rounded-full hover:bg-surface-hover transition-colors">
 {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
 </button>
 </div>

 {isExpanded && (
 <div className="px-5 pb-5 pt-2 border-t border-border animate-[fade-in_0.3s_ease-out]">
 <div className="mb-5 flex flex-wrap items-center gap-4 text-sm text-text-muted font-medium">
 <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {week.estimatedHours} Hours</span>
 <span className="flex items-center gap-1.5">
 {week.cognitiveWorkload === 'Light' ? '🟢' : week.cognitiveWorkload === 'Moderate' ? '🟡' : '🔴'} {week.cognitiveWorkload}
 </span>
 </div>
 <div className="space-y-4">
 <div>
 <h5 className="text-sm font-semibold text-text-secondary mb-2 flex items-center gap-2">
 <BookOpen className="w-4 h-4 text-text-muted" /> Daily Tasks
 </h5>
 <ul className="space-y-2">
 {week.tasks.map((task, idx) => (
 <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary ">
 <Check className={`w-4 h-4 mt-0.5 shrink-0 ${week.isCompleted ? 'text-success-500' : 'text-neutral-300 '}`} />
 {task}
 </li>
 ))}
 </ul>
 </div>
 <div className="bg-primary-50 rounded-lg p-3 border border-primary-100 ">
 <h5 className="text-sm font-semibold text-primary-700 mb-1 flex items-center gap-2">
 <MessageSquare className="w-4 h-4" /> Teach Back Activity
 </h5>
 <p className="text-sm text-primary-900 ">{week.teachBackActivity}</p>
 </div>

 <div className="bg-background rounded-lg p-3 border border-border ">
 <h5 className="text-sm font-semibold text-text-secondary mb-1 flex items-center gap-2">
 <Target className="w-4 h-4" /> Reflection Prompt
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
 const currentWeekNum = data.weeks.find(w => w.isCurrent)?.id || 1;

 return (
 <div className="min-h-screen bg-background pb-20">
 {/* Header Section */}
 <div className="bg-surface border-b border-border pt-8 pb-8 mb-6">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <h1 className="text-3xl font-bold text-text-primary mb-2">Your Learning System</h1>
 <div className="flex flex-wrap items-center gap-3">
 <h2 className="text-xl text-text-secondary ">{data.header.goal}</h2>
 <Badge variant="success">{data.header.status}</Badge>
 </div>
 </div>
 <div className="w-full md:w-64">
 <div className="flex justify-between text-sm mb-1.5 font-medium">
 <span className="text-text-secondary ">Progress</span>
 <span className="text-text-primary ">{data.header.progress}%</span>
 </div>
 <ProgressBar value={data.header.progress} />
 <p className="text-xs text-text-muted mt-2 text-right">Est. {data.header.estimatedCompletion}</p>
 </div>
 </div>
 </div>
 </div>

 {/* Roadmap Overview */}
 <RoadmapOverview weeks={data.weeks} />

 {/* Main Two-Column Layout */}
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="flex flex-col lg:flex-row gap-8">
 {/* Mobile Order: Next Action appears on top in mobile, but sidebar is right on desktop */}
 <div className="lg:hidden space-y-4 mb-2">
 <Card className="bg-surface border border-border ">
 <CardContent className="p-4 flex items-center justify-between text-sm font-medium">
 <div className="text-center flex-1">
 <div className="text-text-muted mb-0.5">Progress</div>
 <div className="text-text-primary ">{data.header.progress}%</div>
 </div>
 <div className="w-px h-8 bg-surface-active "></div>
 <div className="text-center flex-1">
 <div className="text-text-muted mb-0.5">Current</div>
 <div className="text-text-primary ">Week {currentWeekNum}</div>
 </div>
 <div className="w-px h-8 bg-surface-active "></div>
 <div className="text-center flex-1">
 <div className="text-text-muted mb-0.5">Streak</div>
 <div className="text-text-primary ">🔥 {data.habits.dailyLearning.streak}</div>
 </div>
 </CardContent>
 </Card>
 <MissionCard mission={data.todaysMission} />
 </div>

 {/* Left Column: Deep Learning Path */}
 <div className="w-full lg:w-2/3 space-y-8">
 {/* SECTION 1: WHY */}
 <section>
 <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">Why This Matters</h3>
 <Card className="bg-surface border-l-4 border-l-primary-500">
 <CardContent className="p-6">
 <p className="text-xl font-medium text-text-primary italic leading-relaxed">
 "{data.why}"
 </p>
 </CardContent>
 </Card>
 </section>

 {/* SECTION 2 & 3: Identity & Success */}
 <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">Identity</h3>
 <Card className="h-full bg-surface text-text-primary ">
 <CardContent className="p-6 flex items-center h-full">
 <p className="text-lg font-medium">{data.identity}</p>
 </CardContent>
 </Card>
 </div>
 <div>
 <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">Success Looks Like</h3>
 <Card className="h-full bg-surface ">
 <CardContent className="p-6 flex items-center h-full">
 <p className="text-lg text-text-secondary ">{data.successDefinition}</p>
 </CardContent>
 </Card>
 </div>
 </section>

 {/* SECTION 4: System Principles */}
 <section>
 <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">System Principles</h3>
 <Card className="bg-surface ">
 <CardContent className="p-6">
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
 {data.systemPrinciples.map((principle, idx) => (
 <div key={idx} className="flex items-center gap-3">
 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-50 text-success-600 ">
 <CheckCircle2 className="w-5 h-5" />
 </div>
 <span className="font-medium text-text-secondary ">{principle}</span>
 </div>
 ))}
 </div>
 </CardContent>
 </Card>
 </section>

 {/* SECTION 5: Weekly Learning Journey */}
 <section className="pt-4">
 <h3 className="text-2xl font-bold text-text-primary mb-6">Weekly Learning Journey</h3>
 <div className="ml-2">
 {data.weeks.map(week => (
 <WeekCard key={week.id} week={week} />
 ))}
 </div>
 </section>

 </div>

 {/* Right Column: Sticky Sidebar (Desktop) */}
 <div className="w-full lg:w-1/3 space-y-6">
 <div className="sticky top-6 space-y-6">
 <div className="hidden lg:block space-y-6">
 {/* Refinement 6: Progress Summary */}
 <Card className="bg-surface border border-border ">
 <CardContent className="p-5 flex items-center justify-between text-sm font-medium">
 <div className="text-center">
 <div className="text-text-muted mb-1">Progress</div>
 <div className="text-text-primary ">{data.header.progress}%</div>
 </div>
 <div className="w-px h-10 bg-surface-active "></div>
 <div className="text-center">
 <div className="text-text-muted mb-1">Current</div>
 <div className="text-text-primary ">Week {currentWeekNum} of {parseInt(data.header.estimatedCompletion)}</div>
 </div>
 <div className="w-px h-10 bg-surface-active "></div>
 <div className="text-center">
 <div className="text-text-muted mb-1">Streak</div>
 <div className="text-text-primary ">🔥 {data.habits.dailyLearning.streak}</div>
 </div>
 </CardContent>
 </Card>

 <MissionCard mission={data.todaysMission} />
 </div>
 <MotivationCard />
 <HabitTracker habits={data.habits} />
 </div>
 </div>

 </div>
 </div>
 </div>
 );
};
