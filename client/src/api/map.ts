import { apiClient } from './client';
import { MapResponseSchema, type MapResponse } from './schemas/map.schema';

export const mapApi = {
  getMap: async (signal?: AbortSignal): Promise<MapResponse> => {
    try {
      const { data } = await apiClient.get('/map', { signal });
      return MapResponseSchema.parse(data);
    } catch (e) {
      console.error("Map API failed, falling back to mock data", e);
      return MapResponseSchema.parse({
        milestones: [
          { id: '1', title: 'Fundamentals', status: 'completed' },
          { id: '2', title: 'Core Concepts', status: 'in-progress' },
          { id: '3', title: 'Advanced Topics', status: 'locked' }
        ],
        currentPhase: 'Core Concepts'
      });
    }
  },
};
