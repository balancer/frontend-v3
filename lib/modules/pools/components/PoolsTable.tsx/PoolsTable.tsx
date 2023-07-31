'use client'

import { getColumns } from './columns'
import { DataTable } from '@/components/_base/DataTable'
import { PoolsList } from '../../types'
import { Box } from '@/components/_base/Box'

interface Props {
  pools: PoolsList
  loading: boolean
}

export function PoolsTable({ pools, loading }: Props) {
  const columns = getColumns()

  return (
    <Box width="full" style={{ position: 'relative' }}>
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
