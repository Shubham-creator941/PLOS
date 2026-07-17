import { apiClient } from './client';
import { DashboardResponseSchema, type DashboardResponse } from './schemas/dashboard.schema';

export const dashboardApi = {
  getDashboard: async (signal?: AbortSignal): Promise<DashboardResponse> => {
    try {
      const { data } = await apiClient.get('/dashboard', { signal });
      return DashboardResponseSchema.parse(data);
    } catch (e) {
      console.error("Dashboard API failed, falling back to mock data", e);
      return DashboardResponseSchema.parse({
        hero: { currentGoal: 'Master System Design' },
        mission: { title: 'Design a load balancer', estimatedTime: '45m', difficulty: 'Hard', focusReady: true },
        intelligence: { messages: ['You are doing great! Keep up the good work.'] },
        momentum: { currentStreak: 3, weeklyCompletion: 5, weeklyTotal: 7 }
      });
    }
  },
};
