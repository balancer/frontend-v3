'use client'

import {
  GetPoolsDocument,
  GetPoolsQuery,
  GetPoolsQueryVariables,
  GqlChain,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/services/api/generated/types'
import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { useState } from 'react'
import { Pagination } from './Pagination'
import { VStack } from '@/components/_base/VStack'
import PoolTable from './PoolsTable.tsx/PoolsTable'

export default function PoolsList() {
  const [numPerPage, setNumPerPage] = useState(10)
  const [pageNum, setPageNum] = useState(0)

  const {
    data: { pools },
    refetch,
  } = useSuspenseQuery<GetPoolsQuery, GetPoolsQueryVariables>(
    GetPoolsDocument,
    {
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
    }
  )

  function handlePageChange(num: number) {
    setPageNum(num)
    refetch({ first: numPerPage, skip: pageNum * numPerPage })
  }

  function handleNumPerPageChange(perPage: number) {
    setNumPerPage(perPage)
    refetch({ first: numPerPage, skip: pageNum * numPerPage })
  }

  return (
    <VStack spacing="md">
      <PoolTable pools={pools} />
      <Pagination
        pageNum={pageNum}
        numPerPage={numPerPage}
        handlePageChange={handlePageChange}
        handleNumPerPageChange={handleNumPerPageChange}
      />
    </VStack>
  )
}
