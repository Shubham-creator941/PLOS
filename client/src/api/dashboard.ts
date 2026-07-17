import { apiClient } from './client';
import { DashboardResponseSchema, type DashboardResponse } from './schemas/dashboard.schema';

export const dashboardApi = {
  getDashboard: async (signal?: AbortSignal): Promise<DashboardResponse> => {
    const { data } = await apiClient.get('/dashboard', { signal });
    return DashboardResponseSchema.parse(data);
  },
};
