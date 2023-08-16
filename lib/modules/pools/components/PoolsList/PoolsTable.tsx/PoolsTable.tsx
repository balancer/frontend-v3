'use client'

import { getColumns } from './columns'
import { PoolsList, PoolsListItem } from '../../../pool.types'
import { Box } from '@chakra-ui/react'
import { DataTable } from '@/components/tables/DataTable'
import { useRouter } from 'next/navigation'
import { getPoolPath } from '../../../pool.utils'

interface Props {
  pools: PoolsList
  loading: boolean
}

export function PoolsTable({ pools, loading }: Props) {
  const columns = getColumns()
  const router = useRouter()

  const rowClickHandler = (event: React.MouseEvent<HTMLElement>, pool: PoolsListItem) => {
    const poolPath = getPoolPath({ id: pool.id, chain: pool.chain })

    if (event.ctrlKey || event.metaKey) {
      window.open(poolPath, '_blank')
    } else {
      router.push(poolPath)
    }
  }

  return (
    <Box w="full" style={{ position: 'relative' }}>
      <DataTable columns={columns} data={pools} rowClickHandler={rowClickHandler} />
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
