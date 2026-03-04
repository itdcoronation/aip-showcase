import { MutationCache, QueryCache } from "@tanstack/react-query";
import { mutationErrorHandler, queryErrorHandler } from "../requests/error-handler";

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      //   retry: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      suspense: false,
      refetchInterval: 0,
      cacheTime: 0,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
    mutations: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query: any) => queryErrorHandler(error, query),
  }),
  mutationCache: new MutationCache({
    onError: mutationErrorHandler,
  }),
};