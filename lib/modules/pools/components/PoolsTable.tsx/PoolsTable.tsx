'use client'

import { getColumns } from './columns'
import { PoolsList } from '../../types'
import { Box } from '@chakra-ui/react'
import { DataTable } from '@/components/tables/DataTable'

interface Props {
  pools: PoolsList
  loading: boolean
}

export function PoolsTable({ pools, loading }: Props) {
  const columns = getColumns()

  return (
    <Box w="full" style={{ position: 'relative' }}>
      <DataTable columns={columns} data={pools} />
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
