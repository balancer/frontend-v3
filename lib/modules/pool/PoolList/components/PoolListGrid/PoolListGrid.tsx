'use client'

import { Grid } from '@chakra-ui/react'
import { usePoolList } from '@/lib/modules/pool/PoolList/usePoolList'
import { PoolListCard } from './PoolListCard'
import { Pagination } from '@/components/pagination/Pagination'
import { usePoolListQueryState } from '../../usePoolListQueryState'
import { getPaginationProps } from '@/components/pagination/getPaginationProps'
import { PoolListItem } from '../../../pool.types'
import { getPoolPath } from '../../../pool.utils'
import { useRouter } from 'next/navigation'

export function PoolListGrid() {
  const router = useRouter()
  const { pools, count } = usePoolList()
  const { pagination, setPagination } = usePoolListQueryState()
  const paginationProps = getPaginationProps(count || 0, pagination, setPagination)

  const showPagination = pools.length && count && count > pagination.pageSize
  const cardClickHandler = (event: React.MouseEvent<HTMLElement>, pool: PoolListItem) => {
    const poolPath = getPoolPath({ id: pool.id, chain: pool.chain })

    if (event.ctrlKey || event.metaKey) {
      window.open(poolPath, '_blank')
    } else {
      router.push(poolPath)
    }
  }

  // Prefetch pool page on card hover, otherwise there is a significant delay
  // between clicking the card and the pool page loading.
  const cardMouseEnterHandler = (event: React.MouseEvent<HTMLElement>, pool: PoolListItem) => {
    const poolPath = getPoolPath({ id: pool.id, chain: pool.chain })
    router.prefetch(poolPath)
  }

  return (
    <>
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(4, 1fr)' }} w="full" gap="4">
        {pools.map(pool => (
          <PoolListCard
            key={pool.id}
            pool={pool}
            cardClickHandler={cardClickHandler}
            cardMouseEnterHandler={cardMouseEnterHandler}
          />
        ))}
      </Grid>
      {showPagination && <Pagination {...paginationProps} />}
    </>
  )
}
