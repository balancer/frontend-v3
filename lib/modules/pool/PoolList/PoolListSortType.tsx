import { HStack, IconButton, Select } from '@chakra-ui/react'
import { FiArrowDown, FiArrowUp } from 'react-icons/fi'
import { usePoolListQueryState } from './usePoolListQueryState'
import { GqlPoolOrderBy } from '@/lib/shared/services/api/generated/graphql'
import { orderByHash } from '../pool.types'

export function PoolListSortType() {
  const { sorting, setSorting } = usePoolListQueryState()

  return (
    <HStack mr={5}>
      <Select
        w="32"
        value={sorting[0].id}
        onChange={e => {
          setSorting([{ id: e.target.value as GqlPoolOrderBy, desc: sorting[0].desc }])
        }}
      >
        {['totalLiquidity', 'volume24h', 'apr'].map(sortType => (
          <option key={sortType} value={sortType}>
            {orderByHash[sortType]}
          </option>
        ))}
      </Select>
      <IconButton
        icon={<FiArrowDown />}
        aria-label="sort-desc"
        onClick={() => setSorting([{ id: sorting[0].id, desc: true }])}
        isDisabled={sorting[0].desc}
      />
      <IconButton
        icon={<FiArrowUp />}
        aria-label="sort-asc"
        onClick={() => setSorting([{ id: sorting[0].id, desc: false }])}
        isDisabled={!sorting[0].desc}
      />
    </HStack>
  )
}
