import { QueryClient } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // disable refetch on window focus

      // milliseconds after data is considered stale and ready for refetching. This value only applies to the hook it is defined on.
      staleTime: 0,

      // 1 minute - cache data remains in memory. When a query's cache becomes unused or inactive, that cache data will be garbage collected after this duration.
      cacheTime: 0,

      // when query fails (the query function throws an error), React Query will automatically retry the query if that query's request has not reached the max number of consecutive retries (defaults to 3) or a function is provided to determine if a retry is allowed.
      retry: false,

      //keep previous data on refetch
      keepPreviousData: true
    }
  }
});

export default queryClient;