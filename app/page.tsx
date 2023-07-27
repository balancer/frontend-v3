'use client'
export const dynamic = 'force-dynamic'

import { Box } from '@/components/_base/Box'
import PoolsList from '@/lib/modules/pools/components/PoolsList'
import {
  GetPoolsDocument,
  GqlChain,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/services/api/generated/graphql'
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'

export default function Home() {
  useSuspenseQuery(GetPoolsDocument, {
    variables: {
      first: 10,
      skip: 0,
      orderBy: GqlPoolOrderBy.TotalLiquidity,
      orderDirection: GqlPoolOrderDirection.Desc,
      where: {
        chainNotIn: [GqlChain.Fantom, GqlChain.Optimism],
        poolTypeIn: [
          GqlPoolFilterType.Weighted,
          GqlPoolFilterType.Stable,
          GqlPoolFilterType.PhantomStable,
          GqlPoolFilterType.MetaStable,
        ],
      },
    },
  })

  return (
    <Box as="main" padd="md">
      <PoolsList />
    </Box>
  )
}
