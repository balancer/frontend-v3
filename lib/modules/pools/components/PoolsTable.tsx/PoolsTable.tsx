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
    <Box w="full">
      <DataTable columns={columns} data={pools} />
      {loading && <Box>Loading...</Box>}
    </Box>
  )
}
