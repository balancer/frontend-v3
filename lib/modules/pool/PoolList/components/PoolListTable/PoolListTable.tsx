'use client'

import { getPoolListTableColumns } from './PoolListTable.columns'
import { PoolListItem } from '../../../pool.types'
import { Box } from '@chakra-ui/react'
import { DataTable } from '@/components/tables/DataTable'
import { useRouter } from 'next/navigation'
import { getPoolPath } from '../../../pool.utils'
import { usePoolList } from '@/lib/modules/pool/PoolList/usePoolList'
import { useTranslations } from 'next-intl'
import { PaginationState } from '@tanstack/react-table'

export function PoolListTable() {
  const t = useTranslations('PoolListTable')
  const columnTitles = {
    network: t('columns.network'),
    details: t('columns.details'),
    totalLiquidity: t('columns.totalLiquidity'),
    volume24h: t('columns.volume24h'),
    apr: t('columns.apr'),
  }
  const { pools, loading, sorting, setSort, count, refetch } = usePoolList()
  const columns = getPoolListTableColumns(columnTitles)
  const router = useRouter()

  const rowClickHandler = (event: React.MouseEvent<HTMLElement>, pool: PoolListItem) => {
    const poolPath = getPoolPath({ id: pool.id, chain: pool.chain })

    if (event.ctrlKey || event.metaKey) {
      window.open(poolPath, '_blank')
    } else {
      router.push(poolPath)
    }
  }

  // Prefetch pool page on row hover, otherwise there is a significant delay
  // between clicking the row and the pool page loading.
  const rowMouseEnterHandler = (event: React.MouseEvent<HTMLElement>, pool: PoolListItem) => {
    const poolPath = getPoolPath({ id: pool.id, chain: pool.chain })
    router.prefetch(poolPath)
  }

  const onPaginationChangeHandler = (value: PaginationState) =>
    refetch({ first: value.pageSize, skip: value.pageIndex * value.pageSize })

  return (
    <Box w="full" style={{ position: 'relative' }}>
      <DataTable
        columns={columns}
        data={pools}
        sorting={sorting}
        setSorting={setSort}
        rowClickHandler={rowClickHandler}
        rowMouseEnterHandler={rowMouseEnterHandler}
        rowCount={count || -1}
        onPaginationChangeHandler={onPaginationChangeHandler}
      />
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
