'use client'

import { getColumns } from './columns'
import { DataTable } from '@/components/_base/DataTable'
import { PoolsList } from '../../types'
import { Box } from '@/components/_base/Box'

interface Props {
  pools: PoolsList
}

export function PoolsTable({ pools }: Props) {
  const columns = getColumns()

  return (
    <Box width="full">
      <DataTable columns={columns} data={pools} />
    </Box>
  )
}
