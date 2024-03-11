import { HStack, IconButton, Select } from '@chakra-ui/react'
import { usePoolListQueryState } from './usePoolListQueryState'
import { GqlPoolOrderBy } from '@/lib/shared/services/api/generated/graphql'
import { orderByHash } from '../pool.types'
import { usePoolOrderByState } from './usePoolOrderByState'
import { ChevronDown, ChevronUp } from 'react-feather'

export function PoolListSortType() {
  const { sorting, setSorting } = usePoolListQueryState()
  const { orderBy } = usePoolOrderByState()

  return (
    <HStack mr={5}>
      <Select
        w="32"
        value={sorting[0].id}
        onChange={e => {
          setSorting([{ id: e.target.value as GqlPoolOrderBy, desc: sorting[0].desc }])
        }}
      >
        {orderBy.map(sortType => (
          <option key={sortType} value={sortType}>
            {orderByHash[sortType]}
          </option>
        ))}
      </Select>
      <IconButton
        icon={<ChevronDown />}
        aria-label="sort-desc"
        onClick={() => setSorting([{ id: sorting[0].id, desc: true }])}
        isDisabled={sorting[0].desc}
      />
      <IconButton
        icon={<ChevronUp />}
        aria-label="sort-asc"
        onClick={() => setSorting([{ id: sorting[0].id, desc: false }])}
        isDisabled={!sorting[0].desc}
      />
    </HStack>
  )
}
