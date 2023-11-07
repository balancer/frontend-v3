'use client'

import { useRef } from 'react'
import { useApolloClient, DataProxy, OperationVariables } from '@apollo/client'

export function useSeedApolloCache<TData = any, TVariables = OperationVariables>(
  options: DataProxy.WriteQueryOptions<TData, TVariables>
) {
  const loaded = useRef(false)
  const client = useApolloClient()

  if (!loaded.current) {
    client.writeQuery(options)

    loaded.current = true
  }
}
