import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  main: () => [...dashboardKeys.all, 'main'] as const,
};

export const useDashboardQuery = () => {
  return useQuery({
    queryKey: dashboardKeys.main(),
    queryFn: async ({ signal }) => {
      return dashboardApi.getDashboard(signal);
    },
  });
};
