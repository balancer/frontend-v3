'use client'
/* eslint-disable react-hooks/exhaustive-deps */

import {
  Badge,
  Box,
  Button,
  ButtonProps,
  Center,
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
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  VStack,
} from '@chakra-ui/react'
import { PoolListSearch } from './PoolListSearch'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { usePoolListQueryState } from './usePoolListQueryState'
import { PoolFilterType, poolTypeFilters } from '../pool.types'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useEffect, useState } from 'react'
import { Filter } from 'react-feather'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { useDebouncedCallback } from 'use-debounce'
import { defaultDebounceMs } from '@/lib/shared/utils/queries'

const SLIDER_MAX_VALUE = 10000000
const SLIDER_STEP_SIZE = 100000

function UserPoolFilter() {
  const { userAddress, toggleUserAddress } = usePoolListQueryState()
  const { userAddress: connectedUserAddress } = useUserAccount()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (connectedUserAddress) {
      setChecked(userAddress === connectedUserAddress)
    } else {
      setChecked(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress, connectedUserAddress])

  return (
    <Checkbox
      isChecked={checked}
      onChange={e => toggleUserAddress(e.target.checked, connectedUserAddress as string)}
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

function PoolMinTvlFilter() {
  const { toCurrency } = useCurrency()
  const { minTvl, setMinTvl } = usePoolListQueryState()
  const [sliderValue, setSliderValue] = useState(minTvl)

  const debounced = useDebouncedCallback((val: number) => {
    setMinTvl(val)
  }, defaultDebounceMs)

  // set min tvl value here to keep slider performant
  useEffect(() => {
    debounced(sliderValue)
  }, [sliderValue])

  // sync slider value with minTvl value
  useEffect(() => {
    setSliderValue(minTvl)
  }, [minTvl])

  return (
    <VStack w="full">
      <HStack w="full">
        <Heading as="h3" size="sm">
          Minimum TVL
        </Heading>
        <Text ml="auto">{toCurrency(sliderValue)}</Text>
      </HStack>
      <Slider
        aria-label="slider-min-tvl"
        onChange={val => setSliderValue(val)}
        value={sliderValue}
        min={0}
        max={SLIDER_MAX_VALUE}
        step={SLIDER_STEP_SIZE}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </VStack>
  )
}

export function FilterTags() {
  const { networks, toggleNetwork, poolTypes, togglePoolType, poolTypeLabel, minTvl, setMinTvl } =
    usePoolListQueryState()
  const { toCurrency } = useCurrency()

  if (networks.length === 0 && poolTypes.length === 0 && minTvl === 0) {
    return <></>
  }

  return (
    <HStack spacing="sm" wrap="wrap" mt="2">
      {poolTypes.map(poolType => (
        <Tag key={poolType} size="lg">
          <TagLabel>{poolTypeLabel(poolType)}</TagLabel>
          <TagCloseButton onClick={() => togglePoolType(false, poolType)} />
        </Tag>
      ))}
      {networks.map(network => (
        <Tag key={network} size="lg">
          <TagLabel>
            <Text fontWeight="bold" textTransform="capitalize">
              {network.toLowerCase()}
            </Text>
          </TagLabel>
          <TagCloseButton onClick={() => toggleNetwork(false, network)} />
        </Tag>
      ))}
      <Tag key="minTvl" size="lg">
        <TagLabel>
          <Text fontWeight="bold" textTransform="capitalize">
            {`TVL > ${toCurrency(minTvl)}`}
          </Text>
        </TagLabel>
        <TagCloseButton onClick={() => setMinTvl(0)} />
      </Tag>
    </HStack>
  )
}

const FilterButton = forwardRef<ButtonProps, 'button'>((props, ref) => {
  const { totalFilterCount } = usePoolListQueryState()
  const { isMobile } = useBreakpoints()

  return (
    <Button ref={ref} {...props} display="flex" gap="2" variant="tertiary">
      <Icon as={Filter} boxSize={4} />
      {!isMobile && 'Filters'}
      {totalFilterCount > 0 && (
        <Badge colorScheme="green" borderRadius="full" p="0">
          <Center h="5" w="5">
            {totalFilterCount}
          </Center>
        </Badge>
      )}
    </Button>
  )
})

export function PoolListFilters() {
  const { isConnected } = useUserAccount()

  return (
    <VStack w="full">
      <HStack w="full" spacing="none" justify="end">
        <PoolListSearch />
        <Popover>
          <PopoverTrigger>
            <FilterButton ml="sm" />
          </PopoverTrigger>
          <Box zIndex="popover" shadow="2xl">
            <PopoverContent>
              <PopoverArrow bg="background.level3" />
              <PopoverCloseButton />
              <PopoverBody p="md">
                <VStack align="start">
                  {isConnected && (
                    <>
                      <Heading as="h3" size="sm" mb="1.5">
                        My Liquidity
                      </Heading>
                      <UserPoolFilter />
                      <Divider />
                    </>
                  )}
                  <Heading as="h3" size="sm" mb="1.5">
                    Pool types
                  </Heading>
                  <PoolTypeFilters />
                  <Divider />
                  <Heading as="h3" size="sm">
                    Networks
                  </Heading>
                  <PoolNetworkFilters />
                  <Divider />
                  <PoolMinTvlFilter />
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Box>
        </Popover>
      </HStack>
    </VStack>
  )
}
