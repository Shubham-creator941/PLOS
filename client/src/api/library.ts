import { apiClient } from './client';
import { LibraryResponseSchema, type LibraryResponse } from './schemas/library.schema';

export const libraryApi = {
  getLibrary: async (signal?: AbortSignal): Promise<LibraryResponse> => {
    try {
      const { data } = await apiClient.get('/library', { signal });
      return LibraryResponseSchema.parse(data);
    } catch (e) {
      console.error("Library API failed, falling back to mock data", e);
      return LibraryResponseSchema.parse({
        resources: [
          { id: 'res-1', title: 'System Design Interview Book', type: 'article', url: 'https://example.com' },
          { id: 'res-2', title: 'Load Balancing Explaination', type: 'video', url: 'https://example.com' }
        ]
      });
    }
  },
};
