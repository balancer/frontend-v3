import { QueryClient } from '@tanstack/react-query'

export const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent vitest from garbage collecting cache
      cacheTime: Infinity,
      // Turn off retries to prevent timeouts
      retry: false,
    },
  },
  logger: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    error: () => {},
    log: console.log,
    warn: console.warn,
  },
})

export function aSuccessfulQueryResultMock() {
  return {
    status: 'success',
    isLoading: false,
    isLoadingError: false,
    isRefetchError: false,
    isRefetching: false,
    isSuccess: true,
    isError: false,
    error: null,
    refetch: vi.fn(),
  } as const
}
