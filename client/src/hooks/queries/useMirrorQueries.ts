import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mirrorApi } from '@/api/mirror';

export const mirrorKeys = {
  all: ['mirror'] as const,
  reflection: (id?: string) => [...mirrorKeys.all, 'reflection', id ?? 'active'] as const,
};

export const useAssessmentQuery = (id?: string) => {
  return useQuery({
    queryKey: mirrorKeys.reflection(id),
    queryFn: async ({ signal }) => {
      return mirrorApi.getReflection(id, signal);
    },
  });
};

export const useSubmitAssessmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string, answer: string }) => mirrorApi.submitReflection(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: mirrorKeys.reflection(payload.id) });
      queryClient.invalidateQueries({ queryKey: mirrorKeys.reflection() });
    },
  });
};
