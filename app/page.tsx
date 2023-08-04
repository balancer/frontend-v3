'use client'
export const dynamic = 'force-dynamic'

import PoolsList from '@/lib/modules/pools/components/PoolsList'
import {
  GetPoolsDocument,
  GqlChain,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/services/api/generated/graphql'
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { Box } from '@chakra-ui/react'

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
    <Box p="md">
      <PoolsList />
    </Box>
  )
}
