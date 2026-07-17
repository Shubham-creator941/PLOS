import { apiClient } from './client';
import { LibraryResponseSchema, type LibraryResponse } from './schemas/library.schema';

export const libraryApi = {
  getLibrary: async (signal?: AbortSignal): Promise<LibraryResponse> => {
    const { data } = await apiClient.get('/library', { signal });
    return LibraryResponseSchema.parse(data);
  },
};
