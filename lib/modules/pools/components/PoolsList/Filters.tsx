'use client'

import {
  Badge,
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
import { GqlChain, GqlPoolFilterType } from '@/lib/services/api/generated/graphql'
import { usePoolList } from '@/lib/modules/pools/hooks/usePoolList'
import { usePoolFilters } from '@/lib/modules/pools/hooks/usePoolFilters'
import { useEffect } from 'react'

type FilterProps = {
  filters: ReturnType<typeof usePoolFilters>
}

function PoolTypeFilters({ filters }: FilterProps) {
  const { poolTypes, poolTypeFilters, addPoolTypeFilter, removePoolTypeFilter, mappedPoolTypes } =
    filters
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

function PoolNetworkFilters({ filters }: FilterProps) {
  const { networks, networkFilters, addNetworkFilter, removeNetworkFilter } = filters
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

export function Filters() {
  const filters = usePoolFilters()

  const totalFilters = filters.poolTypes.length + filters.networks.length

  return (
    <Popover>
      <PopoverTrigger>
        <Button>
          Filters
          {totalFilters > 0 && (
            <Badge ml="2" colorScheme="blue">
              {totalFilters}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <VStack align="start">
            <Heading as="h3" size="sm">
              Pool types
            </Heading>
            <PoolTypeFilters filters={filters} />
            <Divider />
            <Heading as="h3" size="sm">
              Networks
            </Heading>
            <PoolNetworkFilters filters={filters} />
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
