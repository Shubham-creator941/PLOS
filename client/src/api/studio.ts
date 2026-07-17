import { apiClient } from './client';
import { StudioSessionSchema, type StudioSession } from './schemas/studio.schema';

export const studioApi = {
  getSession: async (id: string, signal?: AbortSignal): Promise<StudioSession> => {
    const { data } = await apiClient.get(`/studio/sessions/${id}`, { signal });
    return StudioSessionSchema.parse(data);
  },
};
