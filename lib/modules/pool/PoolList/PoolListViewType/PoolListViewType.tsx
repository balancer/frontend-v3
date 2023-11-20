import { HStack, IconButton } from '@chakra-ui/react'
import { FiList, FiGrid } from 'react-icons/fi'
import {
  usePoolListViewType,
  ViewType,
} from '@/lib/modules/pool/PoolList/PoolListViewType/usePoolListViewType'

export function PoolListViewType() {
  const { setViewType, isCardsView, isTableView } = usePoolListViewType()
  return (
    <HStack>
      <IconButton
        icon={<FiList />}
        aria-label="list"
        onClick={() => setViewType(ViewType.Table)}
        isDisabled={isTableView}
      />
      <IconButton
        icon={<FiGrid />}
        aria-label="grid"
        onClick={() => setViewType(ViewType.Cards)}
        isDisabled={isCardsView}
      />
    </HStack>
  )
}
