'use client'
import {
  PoolListProvider,
  usePoolListSeedCacheQuery,
} from '@/lib/modules/pool/PoolList/usePoolList'
import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { Box } from '@chakra-ui/react'
import {
  GetAppGlobalDataDocument,
  GetPoolsDocument,
  GetPoolsQuery,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/shared/services/api/generated/graphql'
import { useApolloClient } from '@apollo/client'
import { useRef } from 'react'
import { PROJECT_CONFIG } from '@/lib/config/getProjectConfig'

export default function PoolListWrapper({ data }: { data: GetPoolsQuery }) {
  //usePoolListSeedCacheQuery()

  const loaded = useRef(false)
  const client = useApolloClient()

  if (!loaded.current) {
    console.log('loading data')
    client.writeQuery({
      query: GetPoolsDocument,
      data: data,
      variables: {
        first: 20,
        skip: 0,
        orderBy: GqlPoolOrderBy.TotalLiquidity,
        orderDirection: GqlPoolOrderDirection.Desc,
        where: {
          poolTypeIn: [
            GqlPoolFilterType.Weighted,
            GqlPoolFilterType.Stable,
            GqlPoolFilterType.PhantomStable,
            GqlPoolFilterType.MetaStable,
            GqlPoolFilterType.Gyro,
            GqlPoolFilterType.Gyro3,
            GqlPoolFilterType.Gyroe,
            GqlPoolFilterType.LiquidityBootstrapping,
          ],
          chainIn: PROJECT_CONFIG.supportedNetworks,
        },
        textSearch: null,
      },
    })

    loaded.current = true
  }

  return (
    <PoolListProvider>
      <Box p="md">
        <PoolList />
      </Box>
    </PoolListProvider>
  )
}
