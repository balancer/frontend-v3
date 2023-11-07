'use client'
/**
 * Apollo Prime Cache Provider
 *
 * This component is used to prime the Apollo cache with data that is needed
 * for the entire application. This is useful for data that is needed on every
 * page, such as token data.
 */
import {
  GetAppGlobalDataDocument,
  GetAppGlobalDataQuery,
} from '@/lib/shared/services/api/generated/graphql'
import { useSeedApolloCache } from '@/lib/shared/hooks/useSeedApolloCache'

interface Props extends React.PropsWithChildren {
  data: GetAppGlobalDataQuery
}

export function ApolloPrimeCacheProvider({ children, data }: Props) {
  useSeedApolloCache({
    query: GetAppGlobalDataDocument,
    data: data,
  })

  return <>{children}</>
}
