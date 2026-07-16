export const dashboardData = {
  hero: {
    greeting: "Good Morning, Priya",
    currentGoal: "Build a Portfolio of Data Science Projects",
    status: "On Track",
    statusIndicator: "🟢",
    estimatedCompletion: "Week 4 of 12",
    overallProgress: 32,
  },
  purpose: {
    why: "I want to transition into AI Engineering.",
    identity: "I am becoming a disciplined AI Engineer.",
    success: "Successfully build three production-ready AI projects."
  },
  mission: {
    title: "Finish Feature Engineering Module",
    estimatedTime: "45 Minutes",
    difficulty: "Medium",
    focusReady: true
  },
  upcomingTasks: [
    { id: 1, title: "Read Chapter 4 of AI Engineering", due: "Today, 8:00 PM", time: "30m", completed: false },
    { id: 2, title: "Complete NumPy Assignment", due: "Tomorrow, 10:00 AM", time: "1h", completed: false },
    { id: 3, title: "Review Gradient Descent", due: "Friday", time: "45m", completed: false },
    { id: 4, title: "Project Setup: House Prices", due: "Saturday", time: "2h", completed: false }
  ],
  momentum: {
    currentStreak: 12,
    learningConsistency: 85, // percentage
    weeklyCompletion: 4,     // tasks completed this week
    weeklyTotal: 5,          // total tasks this week
    monthlyCompletion: 18,
    monthlyTotal: 20
  },
  intelligence: {
    title: "Learning Intelligence",
    status: "🟢",
    heading: "You are on track.",
    messages: [
      "Your consistency is excellent.",
      "Next milestone is achievable."
    ]
  },
  smartNudges: [
    "Remember why you started.",
    "Teaching today's topic to someone will improve retention.",
    "You are only 18 hours away from completing this milestone.",
    "Yesterday's consistency puts you ahead of schedule."
  ],
  health: {
    consistency: { label: "Consistency", status: "green", value: 90 },
    motivation: { label: "Motivation", status: "green", value: 85 },
    knowledgeGrowth: { label: "Knowledge Growth", status: "yellow", value: 70 },
    energy: { label: "Energy", status: "green", value: 80 }
  }
};
