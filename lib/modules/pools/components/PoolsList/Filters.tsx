'use client'

import {
  Badge,
  Button,
  ButtonProps,
  forwardRef,
  Checkbox,
  Divider,
  HStack,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  VStack,
} from '@chakra-ui/react'
import { GqlChain, GqlPoolFilterType } from '@/lib/services/api/generated/graphql'
import { usePoolList } from '@/lib/modules/pools/hooks/usePoolList'
import { useEffect } from 'react'
import { PoolFiltersProvider, usePoolFilters } from '../../hooks/usePoolFilters'

function PoolTypeFilters() {
  const { poolTypes, poolTypeFilters, addPoolTypeFilter, removePoolTypeFilter, mappedPoolTypes } =
    usePoolFilters()
  const { setPoolTypes } = usePoolList()

  function handleToggle(checked: boolean, poolType: GqlPoolFilterType) {
    if (checked) {
      addPoolTypeFilter(poolType)
    } else {
      removePoolTypeFilter(poolType)
    }
  }

  useEffect(() => {
    setPoolTypes(mappedPoolTypes)
  }, [mappedPoolTypes, setPoolTypes])

  return poolTypeFilters.map(poolType => (
    <Checkbox
      key={poolType}
      isChecked={!!poolTypes.find(selected => selected === poolType)}
      onChange={e => handleToggle(e.target.checked, poolType)}
    >
      {poolType}
    </Checkbox>
  ))
}

function PoolNetworkFilters() {
  const { networks, networkFilters, addNetworkFilter, removeNetworkFilter } = usePoolFilters()
  const { setNetworks } = usePoolList()

  function handleToggle(checked: boolean, network: GqlChain) {
    if (checked) {
      addNetworkFilter(network)
    } else {
      removeNetworkFilter(network)
    }
  }

  useEffect(() => {
    setNetworks(networks)
  }, [networks, setNetworks])

  return networkFilters.map(network => (
    <Checkbox
      key={network}
      isChecked={!!networks.find(selected => selected === network)}
      onChange={e => handleToggle(e.target.checked, network)}
    >
      <Text textTransform="capitalize">{network.toLowerCase()}</Text>
    </Checkbox>
  ))
}

function FilterTags() {
  const { poolTypes, networks, removePoolTypeFilter, removeNetworkFilter } = usePoolFilters()

  return (
    <HStack spacing="sm">
      {poolTypes.map(poolType => (
        <Tag key={poolType}>
          <TagLabel>{poolType}</TagLabel>
          <TagCloseButton onClick={() => removePoolTypeFilter(poolType)} />
        </Tag>
      ))}

      {networks.map(network => (
        <Tag key={network}>
          <TagLabel>{network}</TagLabel>
          <TagCloseButton onClick={() => removeNetworkFilter(network)} />
        </Tag>
      ))}
    </HStack>
  )
}

const FilterButton = forwardRef<ButtonProps, 'button'>((props, ref) => {
  const { totalFilterCount } = usePoolFilters()

  return (
    <Button ref={ref} {...props}>
      Filters
      {totalFilterCount > 0 && (
        <Badge ml="2" colorScheme="blue">
          {totalFilterCount}
        </Badge>
      )}
    </Button>
  )
})

export function Filters() {
  return (
    <PoolFiltersProvider>
      <Popover>
        <PopoverTrigger>
          <FilterButton />
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

      <FilterTags />
    </PoolFiltersProvider>
  )
}
