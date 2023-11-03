'use client'

import {
  Badge,
  Button,
  ButtonProps,
  Checkbox,
  Divider,
  FormControl,
  FormControlProps,
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
  Switch,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  VStack,
  FormLabel,
  Stack,
} from '@chakra-ui/react'
import { PoolListSearch } from './PoolListSearch'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import {
  PoolFilterType,
  poolTypeFilters,
  usePoolListQueryState,
} from '@/lib/modules/pool/PoolList/usePoolListQueryState'
import { useUserData } from '@/lib/modules/user/useUserData'
import { usePoolList } from '../usePoolList'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { IoFilter } from 'react-icons/io5'

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
    <Button ref={ref} {...props} display="flex" gap="2">
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

const MyPoolsSwitch = forwardRef<FormControlProps, 'switch'>((props, ref) => {
  const { poolIds, setPoolIds } = usePoolList()
  const { balances } = useUserData()

  const isFilteredByUserPools = poolIds && poolIds?.length > 0

  function toggleMyPools() {
    if (isFilteredByUserPools) {
      setPoolIds(undefined)
    } else {
      setPoolIds([...balances.map(balance => balance.poolId)])
    }
  }

  return (
    <FormControl display="flex" alignItems="center" ref={ref} {...props}>
      <FormLabel htmlFor="my-pools" mb="0">
        My pools
      </FormLabel>
      <Switch id="my-pools" onChange={toggleMyPools} />
    </FormControl>
  )
})

export function PoolListFilters() {
  const { isConnected } = useUserAccount()

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
        {isConnected && <MyPoolsSwitch w="56" />}
      </HStack>
      <FilterTags />
    </VStack>
  )
}
