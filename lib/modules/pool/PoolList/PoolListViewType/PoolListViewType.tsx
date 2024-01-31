import { HStack, IconButton } from '@chakra-ui/react'
import { FiList, FiGrid } from 'react-icons/fi'
import { usePoolListViewType } from './usePoolListViewType'
import { PoolListView } from '@/lib/modules/user/settings/useUserSettings'

export function PoolListViewType() {
  const { setPoolListView, isCardsView, isTableView } = usePoolListViewType()
  return (
    <HStack>
      <IconButton
        icon={<FiList />}
        aria-label="list"
        onClick={() => setPoolListView(PoolListView.List)}
        isDisabled={isTableView}
      />
      <IconButton
        icon={<FiGrid />}
        aria-label="grid"
        onClick={() => setPoolListView(PoolListView.Grid)}
        isDisabled={isCardsView}
      />
    </HStack>
  )
}
