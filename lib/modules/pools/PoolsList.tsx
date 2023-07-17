'use client'

import { Button } from '@/components/_base/Button'
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
import Link from 'next/link'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    refetch({ first: numPerPage, skip: pageNum * numPerPage })
    // eslint-disable-next-line
  }, [numPerPage, pageNum])

  return (
    <>
      <ul>
        {pools.map(pool => (
          <li key={pool.id}>
            <Link href={`/pools/${pool.id}`}>{pool.name}</Link>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center space-x-4">
        <div>Page num: {pageNum}</div>
        {[0, 1, 2].map(num => (
          <Button
            variant={pageNum === num ? 'default' : 'outline'}
            size="sm"
            key={num}
            onClick={() => setPageNum(num)}
          >
            {num + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageNum(pageNum + 1)}
        >
          Next
        </Button>
      </div>

      <div className="mt-4 flex items-center space-x-4">
        <div>No. per page:</div>
        {[10, 20, 30].map(num => (
          <Button
            variant={numPerPage === num ? 'default' : 'outline'}
            key={num}
            onClick={() => setNumPerPage(num)}
          >
            {num}
          </Button>
        ))}
      </div>
    </>
  )
}
