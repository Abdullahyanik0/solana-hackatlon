import { QueryClient } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // disable refetch on window focus
      staleTime: 0,

      cacheTime: 0,

      retry: false,

      keepPreviousData: true
    }
  }
});

export default queryClient;