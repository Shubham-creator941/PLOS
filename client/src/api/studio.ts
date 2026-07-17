import { apiClient } from './client';
import { StudioSessionSchema, type StudioSession } from './schemas/studio.schema';

export const studioApi = {
  getSession: async (id?: string, signal?: AbortSignal): Promise<StudioSession> => {
    // If id is not provided, fetch the active session
    const endpoint = id ? `/studio/sessions/${id}` : `/studio/sessions/active`;
    try {
      const { data } = await apiClient.get(endpoint, { signal });
      return StudioSessionSchema.parse(data);
    } catch (e) {
      console.error("Studio API failed, falling back to mock data", e);
      return StudioSessionSchema.parse({
        task: { id: 'task-1', title: 'Implement rate limiting', type: 'development', description: 'Add rate limiting to the authentication routes.' },
        focusTimeTarget: 25
      });
    }
  },
  pauseSession: async (id: string): Promise<void> => {
    await apiClient.post(`/studio/sessions/${id}/pause`);
  },
  resumeSession: async (id: string): Promise<void> => {
    await apiClient.post(`/studio/sessions/${id}/resume`);
  },
  endSession: async (id: string): Promise<void> => {
    await apiClient.post(`/studio/sessions/${id}/end`);
  },
};
