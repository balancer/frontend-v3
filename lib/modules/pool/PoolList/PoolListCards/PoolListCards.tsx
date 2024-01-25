'use client'

import { Box, Grid } from '@chakra-ui/react'
import { PoolListCard } from './PoolListCard'
import { Pagination } from '@/lib/shared/components/pagination/Pagination'
import { usePoolListQueryState } from '../usePoolListQueryState'
import { getPaginationProps } from '@/lib/shared/components/pagination/getPaginationProps'
import { PoolListItem } from '../../pool.types'

interface Props {
  pools: PoolListItem[]
  count: number
  loading: boolean
}

export function PoolListCards({ pools, count, loading }: Props) {
  const { pagination, setPagination } = usePoolListQueryState()
  const paginationProps = getPaginationProps(count, pagination, setPagination)
  const showPagination = pools.length && count && count > pagination.pageSize

  return (
    <Box w="full" style={{ position: 'relative' }}>
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(4, 1fr)' }} w="full" gap="4">
        {pools.map(pool => (
          <PoolListCard key={pool.id} pool={pool} />
        ))}
      </Grid>
      {showPagination && <Pagination {...paginationProps} />}
      {loading && (
        <Box
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            background: 'black',
            top: 0,
            left: 0,
            opacity: 0.3,
            borderRadius: 10,
          }}
        ></Box>
      )}
    </Box>
  )
}
