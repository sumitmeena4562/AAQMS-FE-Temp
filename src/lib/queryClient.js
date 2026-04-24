import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // Global query error handling - Ignore silent cancellations
      if (error?.message?.includes('canceled')) return;
      toast.error(`Sync Error: ${error.message || 'Check connection'}`);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      // Global mutation error handling - Ignore silent cancellations
      if (error?.message?.includes('canceled')) return;
      toast.error(`Action Failed: ${error.message || 'Please try again'}`);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,    // 10 minutes (Globally fresh)
      gcTime: 30 * 60 * 1000,      // 30 minutes cache retention
      refetchOnWindowFocus: false, // Performance optimization
      refetchOnMount: false,       // DO NOT RE-FETCH ON SCREEN REMOUNT if data is in cache
      retry: 1,                    
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    }
  }
});
