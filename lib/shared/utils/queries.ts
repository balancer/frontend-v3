import { UseQueryResult } from '@tanstack/react-query'

export function isLoadingQueries(...queries: Pick<UseQueryResult, 'isLoading'>[]): boolean {
  return queries.some(query => query.isLoading)
}

export function isRefetchingQueries(...queries: Pick<UseQueryResult, 'isRefetching'>[]): boolean {
  return queries.some(query => query.isRefetching)
}
