import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // Global query error handling
      toast.error(`Sync Error: ${error.message || 'Check connection'}`);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      // Global mutation error handling
      toast.error(`Action Failed: ${error.message || 'Please try again'}`);
    },
  }),
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 1,
    }
  }
});
