import { useQuery } from '@tanstack/react-query';
import { mapApi } from '@/api/map';

export const mapKeys = {
  all: ['map'] as const,
  main: () => [...mapKeys.all, 'main'] as const,
};

export const useMapQuery = () => {
  return useQuery({
    queryKey: mapKeys.main(),
    queryFn: async ({ signal }) => {
      return mapApi.getMap(signal);
    },
  });
};
