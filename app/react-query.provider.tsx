'use client'

import { captureError } from '@/lib/shared/utils/errors'
import {
  SentryMetadata,
  captureSentryError,
  shouldIgnoreError,
} from '@/lib/shared/utils/query-errors'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // Global handler for every react-query error
    onError: (error, query) => {
      if (shouldIgnoreError(error)) return
      console.log('Sentry capturing error: ', {
        meta: query?.meta,
        error,
        queryKey: query.queryKey,
      })

      if (query?.meta) return captureSentryError(error, query?.meta as SentryMetadata)

      // Unexpected error in query (as expected errors should have query.meta)
      captureError(error, { extra: { queryKey: query.queryKey } })
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
