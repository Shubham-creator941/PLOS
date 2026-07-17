import { apiClient } from './client';
import { MapResponseSchema, type MapResponse } from './schemas/map.schema';

export const mapApi = {
  getMap: async (signal?: AbortSignal): Promise<MapResponse> => {
    const { data } = await apiClient.get('/map', { signal });
    return MapResponseSchema.parse(data);
  },
};
