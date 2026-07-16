import React, { useState, useEffect } from 'react';
import { PlayCircle, CheckCircle2, Circle, HeartPulse, Brain, Calendar, Target, TrendingUp, Lightbulb, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { dashboardData } from '../mocks/dashboard';

// ==========================================
// Custom UI Elements
// ==========================================

const ProgressRing = ({ progress, size = 64, strokeWidth = 6, colorClass = "text-primary-500" }: { progress: number, size?: number, strokeWidth?: number, colorClass?: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          className="text-neutral-200 dark:text-neutral-800"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${colorClass} transition-all duration-1000 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className="absolute text-xs font-bold text-neutral-800 dark:text-neutral-100">
        {progress}%
      </span>
    </div>
  );
};

// ==========================================
// Sub-components
// ==========================================

const SmartNudges = () => {
  const [nudgeIndex, setNudgeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setNudgeIndex((prev) => (prev + 1) % dashboardData.smartNudges.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-primary-50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-900/30">
      <CardContent className="p-5 flex items-start gap-4">
        <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div className="min-h-[48px] flex items-center">
          <p className="text-sm font-medium text-primary-900 dark:text-primary-100 animate-[fade-in_0.5s_ease-in-out]">
            {dashboardData.smartNudges[nudgeIndex]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const HealthIndicator = ({ label, status, value }: { label: string, status: string, value: number }) => {
  const statusColors: Record<string, string> = {
    green: 'bg-success-500',
    yellow: 'bg-warning-500',
    red: 'bg-danger-500'
  };

  return (
    <div className="flex items-center justify-between group">
      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">{label}</span>
      <div className="flex items-center gap-3">
        <div className="w-24">
          <ProgressBar value={value} className="opacity-70 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className={`h-2.5 w-2.5 rounded-full ${statusColors[status] || statusColors.green}`} />
      </div>
    </div>
  );
};

// ==========================================
// Main Dashboard Page
// ==========================================

export const Dashboard: React.FC = () => {
  const data = dashboardData;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-20">
      {/* SECTION 1: Hero Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 pt-8 pb-10 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">{data.hero.greeting}</h1>
              <div className="flex flex-wrap items-center gap-3 text-lg">
                <span className="text-neutral-600 dark:text-neutral-400 font-medium">Goal:</span>
                <span className="text-neutral-900 dark:text-neutral-100 font-semibold">{data.hero.currentGoal}</span>
                <Badge variant="neutral" className="ml-2 font-medium">{data.hero.statusIndicator} {data.hero.status}</Badge>
              </div>
            </div>
            
            <div className="w-full lg:w-72">
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span className="text-neutral-600 dark:text-neutral-400">Overall Progress</span>
                <span className="text-neutral-900 dark:text-neutral-50">{data.hero.overallProgress}%</span>
              </div>
              <ProgressBar value={data.hero.overallProgress} />
              <p className="text-xs font-medium text-neutral-500 mt-2.5 text-right">{data.hero.estimatedCompletion}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Three-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {/* COLUMN 1: Purpose & Momentum */}
          <div className="space-y-6">
            
            {/* SECTION 2: Purpose Card */}
            <Card className="h-auto">
              <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary-500" /> Mission Statement
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Why</h4>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 italic border-l-2 border-primary-200 dark:border-primary-800 pl-3">"{data.purpose.why}"</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Identity</h4>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 border-l-2 border-primary-200 dark:border-primary-800 pl-3">{data.purpose.identity}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Success</h4>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 border-l-2 border-primary-200 dark:border-primary-800 pl-3">{data.purpose.success}</p>
                </div>
              </CardContent>
            </Card>

            {/* SECTION 5: Learning Momentum */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-success-500" /> Learning Momentum
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="flex items-center justify-between mb-6 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                      <span className="text-xl">🔥</span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Current Streak</div>
                      <div className="text-xl font-bold text-neutral-900 dark:text-neutral-50">{data.momentum.currentStreak} Days</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-around items-center">
                  <div className="flex flex-col items-center gap-2">
                    <ProgressRing progress={data.momentum.learningConsistency} size={64} colorClass="text-primary-500" />
                    <span className="text-xs font-medium text-neutral-500 text-center">Consistency</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <ProgressRing progress={Math.round((data.momentum.weeklyCompletion / data.momentum.weeklyTotal) * 100)} size={64} colorClass="text-success-500" />
                    <span className="text-xs font-medium text-neutral-500 text-center">This Week<br/>({data.momentum.weeklyCompletion}/{data.momentum.weeklyTotal})</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <ProgressRing progress={Math.round((data.momentum.monthlyCompletion / data.momentum.monthlyTotal) * 100)} size={64} colorClass="text-accent-500" />
                    <span className="text-xs font-medium text-neutral-500 text-center">This Month<br/>({data.momentum.monthlyCompletion}/{data.momentum.monthlyTotal})</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* COLUMN 2: Actions & Tasks */}
          <div className="space-y-6">
            
            {/* SECTION 3: Today's Mission */}
            <Card className="border-2 border-primary-200 dark:border-primary-900/50 shadow-md">
              <div className="p-5 border-b border-primary-100 dark:border-primary-900/30 bg-primary-50/50 dark:bg-primary-900/10">
                <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary-600 dark:text-primary-400" /> Today's Mission
                </h3>
              </div>
              <CardContent className="p-5">
                <h4 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4">{data.mission.title}</h4>
                <div className="flex flex-col gap-3 text-sm text-neutral-700 dark:text-neutral-300 mb-6 font-medium">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neutral-400" /> {data.mission.estimatedTime}
                  </div>
                  <div className="flex items-center gap-2">
                    {data.mission.difficulty === 'Easy' ? '🟢' : data.mission.difficulty === 'Medium' ? '🟡' : '🔴'} {data.mission.difficulty}
                  </div>
                  <div className="flex items-center gap-2">
                    {data.mission.focusReady ? '🟢 Focus Mode Ready' : '⚪ Focus Mode Inactive'}
                  </div>
                </div>
                <Button className="w-full" size="lg">
                  <PlayCircle className="w-5 h-5 mr-2" /> Start Learning Session
                </Button>
              </CardContent>
            </Card>

            {/* SECTION 4: Upcoming Tasks */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4 px-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Upcoming Tasks
              </h3>
              <div className="space-y-3">
                {data.upcomingTasks.map(task => (
                  <Card key={task.id} className="hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
                    <div className="p-4 flex gap-3">
                      <div className="mt-0.5 text-neutral-300 dark:text-neutral-700">
                        {task.completed ? <CheckCircle2 className="w-5 h-5 text-success-500" /> : <Circle className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1.5 leading-tight">{task.title}</h4>
                        <div className="flex items-center gap-3 text-xs font-medium text-neutral-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {task.time}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {task.due}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

          </div>

          {/* COLUMN 3: Intelligence & Health */}
          <div className="space-y-6">
            
            {/* SECTION 6: Learning Intelligence */}
            <Card className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-lg">
              <CardHeader className="pb-3 border-b border-neutral-800 dark:border-neutral-200">
                <CardTitle className="text-base flex items-center gap-2 font-bold">
                  <Brain className="w-4 h-4 text-primary-400 dark:text-primary-600" /> {data.intelligence.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{data.intelligence.status}</span>
                  <h4 className="text-lg font-bold">{data.intelligence.heading}</h4>
                </div>
                <ul className="space-y-2">
                  {data.intelligence.messages.map((msg, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-300 dark:text-neutral-700 font-medium">
                      <span className="text-primary-400 dark:text-primary-600 mt-1">•</span>
                      {msg}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* SECTION 7: Smart Nudges */}
            <SmartNudges />

            {/* SECTION 8: Learning Health */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-danger-500" /> Learning System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                <HealthIndicator label={data.health.consistency.label} status={data.health.consistency.status} value={data.health.consistency.value} />
                <HealthIndicator label={data.health.motivation.label} status={data.health.motivation.status} value={data.health.motivation.value} />
                <HealthIndicator label={data.health.knowledgeGrowth.label} status={data.health.knowledgeGrowth.status} value={data.health.knowledgeGrowth.value} />
                <HealthIndicator label={data.health.energy.label} status={data.health.energy.status} value={data.health.energy.value} />
              </CardContent>
            </Card>

            {/* SECTION 9: Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm uppercase tracking-wider text-neutral-500">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 grid grid-cols-2 gap-2">
                <Button variant="outline" className="w-full justify-start text-xs h-10 px-3">
                  Continue Journey
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs h-10 px-3">
                  View Weekly Plan
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs h-10 px-3">
                  Open Reflection
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs h-10 px-3">
                  Review Teach Back
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};
