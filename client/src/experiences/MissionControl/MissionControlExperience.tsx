import React from 'react';
import { dashboardData } from '../../tests/mocks/dashboard';
import { ArrowRight, Zap, Clock, Brain } from 'lucide-react';
import { Card, CardContent } from '@/primitives';
import { Button } from '@/primitives';

export const Dashboard: React.FC = () => {
 const data = dashboardData;

 return (
 <div className="min-h-screen bg-background text-text-primary px-8 md:px-12 py-12">
 <div className="max-w-7xl mx-auto space-y-16">
 
 {/* HEADER */}
 <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <h1 className="text-sm font-semibold tracking-widest uppercase text-text-muted mb-2">Workspace Overview</h1>
 <h2 className="text-3xl font-bold tracking-tight text-text-primary">Good Morning, Priya</h2>
 </div>
 <div className="flex items-center gap-3 text-sm font-medium">
 <span className="text-text-secondary">Current Goal:</span>
 <span className="text-text-primary px-3 py-1.5 bg-surface-secondary rounded-md border border-border">{data.hero.currentGoal}</span>
 </div>
 </header>

 {/* PRIMARY LAYOUT GRID */}
 <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
 
 {/* MAIN CONTENT AREA */}
 <div className="space-y-12">
 
 {/* TODAY'S MISSION (Hero Card) */}
 <Card className="bg-surface border-border overflow-hidden relative">
 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
 <CardContent className="p-8 md:p-10 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
 <div>
 <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-widest text-primary">
 <Zap className="w-4 h-4" /> Today's Focus
 </div>
 <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{data.mission.title}</h3>
 <div className="flex items-center gap-4 text-sm font-medium text-text-secondary">
 <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {data.mission.estimatedTime}</span>
 <span className="text-border">•</span>
 <span>{data.mission.difficulty}</span>
 <span className="text-border">•</span>
 <span className={data.mission.focusReady ? "text-success" : ""}>
 {data.mission.focusReady ? 'Focus Mode Ready' : 'Focus Mode Inactive'}
 </span>
 </div>
 </div>
 <Button size="lg" className="shrink-0 group">
 Start Session <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
 </Button>
 </CardContent>
 </Card>


 </div>
 
 {/* INSIGHTS COLUMN */}
 <div className="space-y-6">
 
 <Card className="bg-surface-secondary border-none">
 <CardContent className="p-8">
 <div className="flex items-center gap-2 mb-4">
 <Brain className="w-5 h-5 text-primary" />
 <h3 className="text-sm font-semibold text-text-primary">AI Insight</h3>
 </div>
 <div className="space-y-4">
 {data.intelligence.messages.map((msg, i) => (
 <p key={i} className="text-sm text-text-secondary leading-relaxed font-medium">
 {msg}
 </p>
 ))}
 </div>
 </CardContent>
 </Card>

 <Card>
 <CardContent className="p-8">
 <h3 className="text-sm font-semibold text-text-secondary mb-6">Momentum</h3>
 <div className="space-y-5 text-sm font-medium">
 <div className="flex justify-between items-center">
 <span className="text-text-muted">Current Streak</span>
 <span className="text-text-primary text-base">{data.momentum.currentStreak} Days 🔥</span>
 </div>
 <div className="w-full h-px bg-border/50" />
 <div className="flex justify-between items-center">
 <span className="text-text-muted">This Week</span>
 <span className="text-text-primary text-base">{data.momentum.weeklyCompletion} <span className="text-text-muted text-sm">/ {data.momentum.weeklyTotal}</span></span>
 </div>
 </div>
 </CardContent>
 </Card>

 <div className="grid grid-cols-2 gap-3 pt-4">
 {['+ Goal', '+ Task', 'Journal', 'Coach'].map(action => (
 <button key={action} className="text-xs font-semibold bg-surface hover:bg-surface-secondary text-text-secondary hover:text-text-primary py-3 rounded-lg transition-colors border border-border shadow-sm">
 {action}
 </button>
 ))}
 </div>

 </div>
 </div>

 </div>
 </div>
 );
};
