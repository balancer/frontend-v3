'use client'

import {
  Badge,
  Button,
  ButtonProps,
  Checkbox,
  Divider,
  forwardRef,
  Heading,
  HStack,
  Icon,
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
import { PoolListSearch } from './PoolListSearch'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { usePoolListQueryState } from './usePoolListQueryState'
import { IoFilter } from 'react-icons/io5'
import { PoolFilterType, poolTypeFilters } from '../pool.types'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useEffect, useState } from 'react'

function UserPoolFilter() {
  const { userAddress, toggleUserAddress } = usePoolListQueryState()
  const { address } = useUserAccount()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (userAddress === address) {
      setChecked(true)
    } else {
      setChecked(false)
    }
  }, [userAddress])

  return (
    <Checkbox
      isChecked={checked}
      onChange={e => toggleUserAddress(e.target.checked, address as string)}
    >
      <Text>Only show my pools</Text>
    </Checkbox>
  )
}

function PoolTypeFilters() {
  const { togglePoolType, poolTypes, poolTypeLabel } = usePoolListQueryState()

  return poolTypeFilters.map(poolType => (
    <Checkbox
      key={poolType}
      isChecked={!!poolTypes.find(selected => selected === poolType)}
      onChange={e => togglePoolType(e.target.checked, poolType as PoolFilterType)}
    >
      <Text textTransform="capitalize">{poolTypeLabel(poolType)}</Text>
    </Checkbox>
  ))
}

function PoolNetworkFilters() {
  const { supportedNetworks } = getProjectConfig()
  const { networks: toggledNetworks, toggleNetwork } = usePoolListQueryState()

  return supportedNetworks.map(network => (
    <Checkbox
      key={network}
      isChecked={!!toggledNetworks.find(toggledNetwork => toggledNetwork === network)}
      onChange={e => toggleNetwork(e.target.checked, network)}
    >
      <Text textTransform="capitalize">{network.toLowerCase()}</Text>
    </Checkbox>
  ))
}

function FilterTags() {
  const { networks, toggleNetwork, poolTypes, togglePoolType, poolTypeLabel } =
    usePoolListQueryState()

  return (
    <HStack spacing="sm" wrap="wrap">
      {poolTypes.map(poolType => (
        <Tag key={poolType}>
          <TagLabel>{poolTypeLabel(poolType)}</TagLabel>
          <TagCloseButton onClick={() => togglePoolType(false, poolType)} />
        </Tag>
      ))}

      {networks.map(network => (
        <Tag key={network}>
          <TagLabel>
            <Text textTransform="capitalize">{network.toLowerCase()}</Text>
          </TagLabel>
          <TagCloseButton onClick={() => toggleNetwork(false, network)} />
        </Tag>
      ))}
    </HStack>
  )
}

const FilterButton = forwardRef<ButtonProps, 'button'>((props, ref) => {
  const { totalFilterCount } = usePoolListQueryState()

  return (
    <Button ref={ref} {...props} display="flex" gap="2" variant="tertiary">
      <Icon as={IoFilter} boxSize={4} />
      Filters
      {totalFilterCount > 0 && (
        <Badge ml="2" colorScheme="blue">
          {totalFilterCount}
        </Badge>
      )}
    </Button>
  )
})

export function PoolListFilters() {
  return (
    <VStack align="flex-start" w="full">
      <HStack w="full">
        <PoolListSearch />
        <Popover>
          <PopoverTrigger>
            <FilterButton />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody p="md">
              <VStack align="start">
                <Heading as="h3" size="sm" mb="1.5">
                  My Liquidity
                </Heading>
                <UserPoolFilter />
                <Divider />
                <Heading as="h3" size="sm" mb="1.5">
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
      </HStack>
      <FilterTags />
    </VStack>
  )
}
