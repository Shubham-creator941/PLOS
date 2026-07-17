import { apiClient } from './client';
import { StudioSessionSchema, type StudioSession } from './schemas/studio.schema';

export const studioApi = {
  getSession: async (id?: string, signal?: AbortSignal): Promise<StudioSession> => {
    // If id is not provided, fetch the active session
    const endpoint = id ? `/studio/sessions/${id}` : `/studio/sessions/active`;
    const { data } = await apiClient.get(endpoint, { signal });
    return StudioSessionSchema.parse(data);
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
