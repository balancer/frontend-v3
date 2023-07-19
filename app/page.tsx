import { Pagination } from '@/lib/modules/pools/Pagination'
import { api } from '@/lib/services/api/api.client'
import {
  GqlChain,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/services/api/generated/types'
import Link from 'next/link'
import React from 'react'

interface Props {
  searchParams: {
    page: string
    perPage: string
  }
}

export default async function Home({ searchParams }: Props) {
  const pageNum = Math.max(Number(searchParams.page || '0') - 1, 0)
  const perPage = Number(searchParams.perPage || '10')

  const { pools } = await api.GetPools({
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
      <ul>
        {pools.map(pool => (
          <li key={pool.id}>
            <Link href={`/pools/${pool.id}`}>{pool.name}</Link>
          </li>
        ))}
      </ul>
      <Pagination page={pageNum + 1} perPage={perPage} />
    </div>
  )
}
