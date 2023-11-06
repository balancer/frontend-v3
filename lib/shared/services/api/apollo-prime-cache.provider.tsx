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
import { useRef } from 'react'
import { useApolloClient } from '@apollo/client'

interface Props extends React.PropsWithChildren {
  data: GetAppGlobalDataQuery
}

export function ApolloPrimeCacheProvider({ children, data }: Props) {
  const loaded = useRef(false)
  const client = useApolloClient()

  if (!loaded.current) {
    client.writeQuery({
      query: GetAppGlobalDataDocument,
      data: data,
    })

    loaded.current = true
  }

  return <>{children}</>
}
