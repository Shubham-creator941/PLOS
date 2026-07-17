import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studioApi } from '@/api/studio';
import { dashboardKeys } from './useDashboardQueries';

export const studioKeys = {
  all: ['studio'] as const,
  session: (id?: string) => [...studioKeys.all, 'session', id ?? 'active'] as const,
};

export const useLearningSessionQuery = (id?: string) => {
  return useQuery({
    queryKey: studioKeys.session(id),
    queryFn: async ({ signal }) => {
      return studioApi.getSession(id, signal);
    },
  });
};

export const useSessionMutations = () => {
  const queryClient = useQueryClient();

  const pauseMutation = useMutation({
    mutationFn: (id: string) => studioApi.pauseSession(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: studioKeys.session(id) });
    },
  });

  const resumeMutation = useMutation({
    mutationFn: (id: string) => studioApi.resumeSession(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: studioKeys.session(id) });
    },
  });

  const endMutation = useMutation({
    mutationFn: (id: string) => studioApi.endSession(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: studioKeys.session(id) });
      // Invalidate Dashboard when session ends
      queryClient.invalidateQueries({ queryKey: dashboardKeys.main() });
    },
  });

  return { pauseMutation, resumeMutation, endMutation };
};
