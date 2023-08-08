'use client'

import { useEffect, useState } from 'react'
import { Pagination } from './Pagination'
import { PoolsTable } from './PoolsTable.tsx/PoolsTable'
import {
  GetPoolsDocument,
  GqlChain,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/services/api/generated/graphql'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { VStack } from '@chakra-ui/react'
import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'
import { useAccount } from 'wagmi'
import { useTokens } from '@/lib/modules/tokens/useTokens'

export default function PoolsList() {
  const [numPerPage, setNumPerPage] = useState(10)
  const [pageNum, setPageNum] = useState(0)

  const { address } = useAccount()
  const { tokens } = useTokens()
  useTokenBalances(address, tokens)

  const { data, refetch, loading, previousData } = useQuery(GetPoolsDocument, {
    variables: {
      first: numPerPage,
      skip: pageNum * numPerPage,
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

  useEffect(() => {
    refetch({ first: numPerPage, skip: pageNum * numPerPage })
  }, [numPerPage, pageNum, refetch])

  return (
    <VStack align="start" spacing="md">
      <PoolsTable
        pools={loading && previousData ? previousData.pools : data?.pools || []}
        loading={loading}
      />
      <Pagination
        pageNum={pageNum}
        numPerPage={numPerPage}
        handlePageChange={setPageNum}
        handleNumPerPageChange={setNumPerPage}
      />
    </VStack>
  )
}
