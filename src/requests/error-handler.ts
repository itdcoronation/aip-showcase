import { AxiosError } from "axios";
import { Mutation, Query } from "@tanstack/react-query";
import { clearTokens, getRefreshToken } from "@/requests/token";
import { refreshTokenService } from "@/requests/services/auth/refresh-token";
import { IErrorResponse } from "@/types/request.interface";
import { ROUTES } from "@/lib/routes";

let isRedirecting = false;
let isRefreshing = false;
let failedQueue: {
  query?: Query;
  mutation?: Mutation<unknown, unknown, unknown, unknown>;
  variables?: unknown;
}[] = [];

const errorHandler = (
  error: unknown,
  query?: Query,
  mutation?: Mutation<unknown, unknown, unknown, unknown>,
  variables?: unknown
) => {
  const { status, data } = (error as AxiosError<IErrorResponse>).response!;

  if (status === 401) {
    if (mutation) refreshTokenAndRetry(undefined, mutation, variables);
    else refreshTokenAndRetry(query);
  } else console.error(data?.message);
};

export const queryErrorHandler = (error: unknown, query: Query) => {
  errorHandler(error, query);
};

export const mutationErrorHandler = (
  error: unknown,
  variables: unknown,
  context: unknown,
  mutation: Mutation<unknown, unknown, unknown, unknown>
) => {
  errorHandler(error, undefined, mutation, variables);
};

const processFailedQueue = () => {
  failedQueue.forEach(({ query, mutation, variables }) => {
    if (mutation) {
      const { options } = mutation;
      // Re-set mutation options with original variables and re-execute
      mutation.setOptions({ ...options });
      mutation.execute(variables);
    }
    if (query) query.fetch();
  });
  isRefreshing = false;
  failedQueue = [];
};

const refreshTokenAndRetry = async (
  query?: Query,
  mutation?: Mutation<unknown, unknown, unknown, unknown>,
  variables?: unknown
) => {
  try {
    if (!isRefreshing) {
      isRefreshing = true;
      failedQueue.push({ query, mutation, variables });

      const refreshedToken = await getRefreshToken();
      await refreshTokenService({ token: refreshedToken! });

      processFailedQueue();
    } else failedQueue.push({ query, mutation, variables });
  } catch {
    clearTokens();
    if (!isRedirecting) {
      isRedirecting = true;
      console.log("Redirecting to login...");
      window.location.href = ROUTES.login;
    }
  }
};
