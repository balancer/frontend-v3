'use client'

import NextAdapterApp from 'next-query-params/app'
import { QueryParamProvider } from 'use-query-params'

export function ClientProviders({ children }: React.PropsWithChildren) {
  return <QueryParamProvider adapter={NextAdapterApp}>{children}</QueryParamProvider>
}
