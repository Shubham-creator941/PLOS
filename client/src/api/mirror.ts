import { apiClient } from './client';
import { ReflectionResponseSchema, type ReflectionResponse } from './schemas/mirror.schema';

export const mirrorApi = {
  getReflection: async (id?: string, signal?: AbortSignal): Promise<ReflectionResponse> => {
    const endpoint = id ? `/mirror/reflections/${id}` : `/mirror/reflections/active`;
    try {
      const { data } = await apiClient.get(endpoint, { signal });
      return ReflectionResponseSchema.parse(data);
    } catch (e) {
      console.error("Mirror API failed, falling back to mock data", e);
      return ReflectionResponseSchema.parse({
        id: 'ref-1',
        sessionId: 'session-123',
        content: 'How well did you understand the core concepts?',
        timestamp: new Date().toISOString()
      });
    }
  },
  submitReflection: async (payload: { id: string, answer: string }): Promise<void> => {
    await apiClient.post(`/mirror/reflections/${payload.id}/submit`, { answer: payload.answer });
  }
};
