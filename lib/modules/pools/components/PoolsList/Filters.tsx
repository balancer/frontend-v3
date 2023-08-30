'use client'

import {
  Button,
  Checkbox,
  Divider,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
} from '@chakra-ui/react'
import { usePools } from '../../hooks/usePools'
import { PoolTypeFilter } from '../../pool.types'
import { GqlChain } from '@/lib/services/api/generated/graphql'

function PoolTypeFilters() {
  const {
    poolFilters: { poolTypeFilterState },
  } = usePools()

  const [poolTypeFilters, setPoolTypeFilters] = poolTypeFilterState

  function handleToggle(event: React.ChangeEvent<HTMLInputElement>, filter: PoolTypeFilter) {
    setPoolTypeFilters({
      ...poolTypeFilters,
      [filter]: event.target.checked,
    })
  }

  return Object.keys(poolTypeFilters).map(filter => (
    <Checkbox
      key={filter}
      isChecked={poolTypeFilters[filter as PoolTypeFilter]}
      onChange={e => handleToggle(e, filter as PoolTypeFilter)}
    >
      {filter}
    </Checkbox>
  ))
}

function PoolNetworkFilters() {
  const {
    poolFilters: { poolNetworkFilterState },
  } = usePools()

  const [poolNetworkFilters, setPoolNetworkFilters] = poolNetworkFilterState

  function handleToggle(event: React.ChangeEvent<HTMLInputElement>, filter: PoolTypeFilter) {
    setPoolNetworkFilters({
      ...poolNetworkFilters,
      [filter]: event.target.checked,
    })
  }

  return Object.keys(poolNetworkFilters).map(filter => (
    <Checkbox
      key={filter}
      isChecked={poolNetworkFilters[filter as GqlChain]}
      onChange={e => handleToggle(e, filter as PoolTypeFilter)}
    >
      <Text textTransform="capitalize">{filter.toLowerCase()}</Text>
    </Checkbox>
  ))
}

export function Filters() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button>Filters</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <VStack align="start">
            <Heading as="h3" size="sm">
              Pool types
            </Heading>
            <PoolTypeFilters />
            <Divider />
            <Heading as="h3" size="sm">
              Networks
            </Heading>
            <PoolNetworkFilters />
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
