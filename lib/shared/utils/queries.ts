import { UseQueryResult } from '@tanstack/react-query'

// When you only want a query to refetch when the key changes or refetch is called.
export const onlyExplicitRefetch = {
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
}

export function isLoadingQueries(...queries: Pick<UseQueryResult, 'isLoading'>[]): boolean {
  return queries.some(query => query.isLoading)
}

export function isRefetchingQueries(...queries: Pick<UseQueryResult, 'isRefetching'>[]): boolean {
  return queries.some(query => query.isRefetching)
}

export function refetchQueries(...queries: Pick<UseQueryResult, 'isFetched' | 'refetch'>[]) {
  return Promise.all(queries.map(query => query.refetch()))
}

export const defaultDebounceMs = 300 // milliseconds
