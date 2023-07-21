import { Pagination } from '@/lib/modules/pools/Pagination'
import { apiClient } from '@/lib/services/api/api.client'
import React from 'react'
import { PoolsList } from '@/lib/modules/pools/PoolsList'
import {
  GetPoolsDocument,
  GetPoolsQuery,
  GetPoolsQueryVariables,
  GqlChain,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/services/api/generated/graphql'

interface Props {
  searchParams: {
    page: string
    perPage: string
  }
}

export default async function Home({ searchParams }: Props) {
  const pageNum = Math.max(Number(searchParams.page || '0') - 1, 0)
  const perPage = Number(searchParams.perPage || '10')

  const { pools, count } = await apiClient.request<
    GetPoolsQuery,
    GetPoolsQueryVariables
  >(GetPoolsDocument, {
    first: perPage,
    skip: pageNum * perPage,
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
  })

  return (
    <div className="p-4">
      <PoolsList pools={pools} page={pageNum + 1} perPage={perPage} />
      <Pagination page={pageNum + 1} perPage={perPage} numResults={count} />
    </div>
  )
}
