'use client'

import { captureError } from '@/lib/shared/utils/errors'
import { SentryMetadata, captureSentryError } from '@/lib/shared/utils/query-errors'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // Global handler for every react-query error
    onError: (error, query) => {
      if (query?.meta) return captureSentryError(error, query?.meta as SentryMetadata)
      captureError(error)
    },
  }),
})

export function ReactQueryClientProvider({ children }: { children: ReactNode | ReactNode[] }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
