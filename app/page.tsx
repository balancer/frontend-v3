'use client'

import {
  GqlChain,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
  useGetPoolsQuery,
} from '@/lib/services/api/generated/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [numPerPage, setNumPerPage] = useState(10)
  const [pageNum, setPageNum] = useState(0)

  const { data, refetch } = useGetPoolsQuery({
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
    // eslint-disable-next-line
  }, [numPerPage, pageNum])

  return (
    <main className="p-4">
      <ul>
        {data?.pools.map(pool => (
          <li key={pool.id}>
            <Link href={`/pools/${pool.id}`}>{pool.name}</Link>
          </li>
        ))}
      </ul>
      <div
        style={{ flexDirection: 'row', paddingTop: '12px', userSelect: 'none' }}
      >
        <span style={{ marginRight: '4px' }}>Page num:</span>
        {[0, 1, 2].map(num => (
          <a
            key={num}
            style={{
              marginRight: '4px',
              color: num === pageNum ? undefined : 'blue',
              cursor: 'pointer',
            }}
            onClick={() => setPageNum(num)}
          >
            {num + 1}
          </a>
        ))}
      </div>
      <div
        style={{ flexDirection: 'row', paddingTop: '12px', userSelect: 'none' }}
      >
        <span style={{ marginRight: '4px' }}>Num per page:</span>
        {[10, 20, 30].map(num => (
          <a
            key={num}
            style={{
              marginRight: '4px',
              color: num === numPerPage ? undefined : 'blue',
              cursor: 'pointer',
            }}
            onClick={() => setNumPerPage(num)}
          >
            {num}
          </a>
        ))}
      </div>
    </main>
  )
}
