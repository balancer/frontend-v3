'use client'

import { captureError } from '@/lib/shared/utils/errors'
import { SentryMetadata, captureSentryError, shouldIgnore } from '@/lib/shared/utils/query-errors'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // Global handler for every react-query error
    onError: (error, query) => {
      if (shouldIgnore(error.message, error.stack)) return
      console.log('Sentry capturing query error: ', {
        meta: query?.meta,
        error,
        queryKey: query.queryKey,
      })

      if (query?.meta) return captureSentryError(error, query?.meta as SentryMetadata)

      // Unexpected error in query (as expected errors should have query.meta)
      captureError(error, { extra: { queryKey: query.queryKey } })
    },
  }),
  mutationCache: new MutationCache({
    // Global handler for every react-query mutation error (i.e. useSendTransaction)
    onError: (error, variables, _context, mutation) => {
      if (shouldIgnore(error.message, error.stack)) return
      console.log('Sentry capturing mutation error: ', {
        meta: mutation?.meta,
        error,
        variables,
      })

      if (mutation?.meta) return captureSentryError(error, mutation?.meta as SentryMetadata)

      // Unexpected error in mutation (as expected errors should have query.meta)
      captureError(error, { extra: { variables: variables } })
    },
  }),
})

queryClient.setDefaultOptions({
  queries: {
    /* Avoids problems in simulation and build queries when the user navigates away from the page while waiting for a tx confirmation.
      Without this option, navigating to another tab and coming back was causing useRemoveLiquidityBuildCallDataQuery to be undefined leading to unexpected thrown errors.

      This is equivalent to setting the old keepPreviousData: true option
      More info:
        https://github.com/TanStack/query/discussions/6460
    */
    placeholderData: (prev: any) => prev,
  },
})

export function ReactQueryClientProvider({ children }: { children: ReactNode | ReactNode[] }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
