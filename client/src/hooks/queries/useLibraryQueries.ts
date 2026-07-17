import { useQuery } from '@tanstack/react-query';
import { libraryApi } from '@/api/library';

export const libraryKeys = {
  all: ['library'] as const,
  main: () => [...libraryKeys.all, 'main'] as const,
};

export const useLibraryQuery = () => {
  return useQuery({
    queryKey: libraryKeys.main(),
    queryFn: async ({ signal }) => {
      return libraryApi.getLibrary(signal);
    },
  });
};
