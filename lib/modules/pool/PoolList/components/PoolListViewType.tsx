import { HStack, IconButton } from '@chakra-ui/react'
import { FiList, FiGrid } from 'react-icons/fi'

export type ViewType = 'list' | 'grid'

interface Props {
  setViewType: (value: ViewType) => void
}

export function PoolListViewType({ setViewType }: Props) {
  return (
    <HStack>
      <IconButton icon={<FiList />} aria-label="list" onClick={() => setViewType('list')} />
      <IconButton icon={<FiGrid />} aria-label="grid" onClick={() => setViewType('grid')} />
    </HStack>
  )
}
