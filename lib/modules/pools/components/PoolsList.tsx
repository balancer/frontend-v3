'use client'

import { useEffect, useState } from 'react'
import { Pagination } from './Pagination'
import { VStack } from '@/components/_base/VStack'
import { PoolsTable } from './PoolsTable.tsx/PoolsTable'
import {
  GetPoolsDocument,
  GqlChain,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/services/api/generated/graphql'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'
import { useAccount } from 'wagmi'

export default function PoolsList() {
  const [numPerPage, setNumPerPage] = useState(10)
  const [pageNum, setPageNum] = useState(0)

  const { tokens } = useTokens()
  console.log('tokens', tokens)

  const { address } = useAccount()
  const { data: tokenBalances } = useTokenBalances(address, tokens)
  console.log('token balances', tokenBalances)

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
    <VStack spacing="md">
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
