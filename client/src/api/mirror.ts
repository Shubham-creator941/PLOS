import { apiClient } from './client';
import { ReflectionResponseSchema, type ReflectionResponse } from './schemas/mirror.schema';

export const mirrorApi = {
  getReflection: async (id?: string, signal?: AbortSignal): Promise<ReflectionResponse> => {
    const endpoint = id ? `/mirror/reflections/${id}` : `/mirror/reflections/active`;
    const { data } = await apiClient.get(endpoint, { signal });
    return ReflectionResponseSchema.parse(data);
  },
  submitReflection: async (payload: { id: string, answer: string }): Promise<void> => {
    await apiClient.post(`/mirror/reflections/${payload.id}/submit`, { answer: payload.answer });
  }
};
