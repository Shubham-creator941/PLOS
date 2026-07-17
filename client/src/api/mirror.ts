import { apiClient } from './client';
import { ReflectionResponseSchema, type ReflectionResponse } from './schemas/mirror.schema';

export const mirrorApi = {
  getReflection: async (id: string, signal?: AbortSignal): Promise<ReflectionResponse> => {
    const { data } = await apiClient.get(`/mirror/reflections/${id}`, { signal });
    return ReflectionResponseSchema.parse(data);
  },
};
