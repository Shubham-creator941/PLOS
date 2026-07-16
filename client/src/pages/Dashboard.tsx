import React from 'react';
import { PlayCircle, CheckCircle2, Circle, Brain, Calendar, Clock, ArrowRight, Zap } from 'lucide-react';
import { dashboardData } from '../mocks/dashboard';
import { Button } from '../components/Button';

// Mini Progress bar for inline usage
const MiniProgress = ({ value }: { value: number }) => (
  <div className="w-24 h-1.5 bg-surface-active rounded-full overflow-hidden">
    <div className="h-full bg-primary" style={{ width: `${value}%` }} />
  </div>
);

export const Dashboard: React.FC = () => {
  const data = dashboardData;

  return (
    <div className="min-h-screen bg-background text-text-primary px-6 md:px-12 py-10 max-w-6xl mx-auto">
      
      {/* 1. Header (Inline row) */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">{data.hero.greeting}</h1>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span>Goal: <strong className="text-text-primary font-medium">{data.hero.currentGoal}</strong></span>
            <span className="w-1 h-1 rounded-full bg-surface-active" />
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              {data.hero.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm font-medium">
          <span className="text-text-secondary">Overall Progress</span>
          <MiniProgress value={data.hero.overallProgress} />
          <span>{data.hero.overallProgress}%</span>
        </div>
      </header>

      {/* 2. Today's Mission (Focus area - immediate CTA) */}
      <section className="mb-12 bg-surface rounded-2xl border border-border p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-sm">
        {/* subtle gradient glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" /> Today's Focus
          </h2>
          <h3 className="text-xl font-bold mb-3">{data.mission.title}</h3>
          
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-text-muted">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {data.mission.estimatedTime}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{data.mission.difficulty}</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span className={data.mission.focusReady ? "text-success" : ""}>
              {data.mission.focusReady ? 'Focus Mode Ready' : 'Focus Mode Inactive'}
            </span>
          </div>
        </div>

        <Button size="lg" className="shrink-0 gap-2 pl-5 pr-6 relative z-10">
          <PlayCircle className="w-5 h-5" /> Start Session
        </Button>
      </section>

      {/* 3. Narrative Mission Statement */}
      <section className="mb-16">
        <p className="text-lg md:text-xl leading-relaxed text-text-secondary max-w-4xl font-medium">
          Focusing on being <strong className="text-text-primary">{data.purpose.identity}</strong> to <strong className="text-text-primary">{data.purpose.why}</strong>. 
          Success looks like <strong className="text-text-primary">{data.purpose.success}</strong>.
        </p>
      </section>

      {/* 4. Two Column Layout for dense info */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16">
        
        {/* Left Column: Tasks */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-semibold text-text-primary">Upcoming Tasks</h3>
            <span className="text-xs font-medium text-text-muted">{data.upcomingTasks.length} tasks pending</span>
          </div>
          
          <div className="flex flex-col">
            {data.upcomingTasks.map(task => (
              <div key={task.id} className="group flex items-center gap-4 py-3 border-b border-border/50 last:border-0 hover:bg-surface-hover -mx-3 px-3 rounded-lg transition-colors cursor-pointer">
                <div className="text-text-muted group-hover:text-primary transition-colors">
                  {task.completed ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Circle className="w-4 h-4" />}
                </div>
                <h4 className="text-sm font-medium text-text-primary flex-1">{task.title}</h4>
                <div className="flex items-center gap-4 text-xs text-text-muted opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {task.time}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {task.due}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Momentum & Insights */}
        <div className="space-y-10">
          
          {/* Momentum Metric Bar (Inline) */}
          <div className="space-y-4">
             <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-3">Momentum</h3>
             
             <div className="flex flex-col gap-3.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary flex items-center gap-2"><span className="text-orange-500">🔥</span> Streak</span>
                  <strong className="text-text-primary">{data.momentum.currentStreak} Days</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Consistency</span>
                  <div className="flex items-center gap-3">
                    <MiniProgress value={data.momentum.learningConsistency} />
                    <span className="text-xs text-text-muted w-8 text-right font-medium">{data.momentum.learningConsistency}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">This Week</span>
                  <span className="text-text-primary font-medium">{data.momentum.weeklyCompletion} <span className="text-text-muted">/ {data.momentum.weeklyTotal}</span></span>
                </div>
             </div>
          </div>

          {/* Learning Intelligence */}
          <div className="space-y-4">
             <h3 className="text-sm font-semibold text-text-primary border-b border-border pb-3 flex items-center gap-2">
               <Brain className="w-4 h-4 text-primary" /> AI Insights
             </h3>
             <div className="bg-surface-secondary/50 rounded-xl p-5 text-sm text-text-secondary space-y-3">
                <strong className="text-text-primary block mb-2">{data.intelligence.heading}</strong>
                {data.intelligence.messages.map((msg, i) => (
                  <p key={i} className="leading-relaxed text-xs">{msg}</p>
                ))}
             </div>
          </div>

          {/* Quick Actions (Chips) */}
          <div className="flex flex-wrap gap-2 pt-2">
             {['Continue Journey', 'Weekly Plan', 'Reflection'].map(action => (
                <button key={action} className="text-xs font-medium bg-surface-active hover:bg-border text-text-secondary hover:text-text-primary px-3.5 py-2 rounded-full transition-colors flex items-center gap-1.5">
                  {action} <ArrowRight className="w-3 h-3 opacity-50" />
                </button>
             ))}
          </div>

        </div>
      </div>
    </div>
  );
};
