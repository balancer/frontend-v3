'use client'

import { HStack, IconButton } from '@chakra-ui/react'
import { usePoolListViewType } from './usePoolListViewType'
import { PoolListView } from '@/lib/modules/user/settings/useUserSettings'
import { Grid, List } from 'react-feather'

export function PoolListViewType() {
  const { setPoolListView, isCardsView, isTableView } = usePoolListViewType()
  return (
    <HStack>
      <IconButton
        icon={<List />}
        aria-label="list"
        onClick={() => setPoolListView(PoolListView.List)}
        isDisabled={isTableView}
      />
      <IconButton
        icon={<Grid />}
        aria-label="grid"
        onClick={() => setPoolListView(PoolListView.Grid)}
        isDisabled={isCardsView}
      />
    </HStack>
  )
}
