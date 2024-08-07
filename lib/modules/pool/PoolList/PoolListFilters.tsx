'use client'
/* eslint-disable react-hooks/exhaustive-deps */

import {
  Badge,
  Box,
  Button,
  ButtonProps,
  Center,
  Checkbox,
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
import {
  PoolFilterType,
  poolTypeFilters,
  PoolCategoryType,
  poolCategoryFilters,
} from '../pool.types'
import { useUserAccount } from '@/lib/modules/web3/UserAccountProvider'
import { useEffect, useState } from 'react'
import { Filter } from 'react-feather'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { useDebouncedCallback } from 'use-debounce'
import { defaultDebounceMs } from '@/lib/shared/utils/queries'
import { motion, AnimatePresence } from 'framer-motion'
import { staggeredFadeInUp } from '@/lib/shared/utils/animations'
import { getChainShortName } from '@/lib/config/app.config'
import { usePoolList } from './PoolListProvider'
import { MultiSelect } from '@/lib/shared/components/inputs/MultiSelect'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import Image from 'next/image'

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
      mb="xxs"
      isChecked={checked}
      onChange={e => toggleUserAddress(e.target.checked, connectedUserAddress as string)}
    >
      <Text fontSize="sm">My positions</Text>
    </Checkbox>
  )
}

function PoolCategoryFilters() {
  const { togglePoolCategory, poolCategories, setPoolCategories, poolCategoryLabel } =
    usePoolListQueryState()

  // remove query param when empty
  useEffect(() => {
    if (!poolCategories.length) {
      setPoolCategories(null)
    }
  }, [poolCategories])

  return (
    <Box as={motion.div} initial="hidden" animate="show" exit="exit" variants={staggeredFadeInUp}>
      {poolCategoryFilters.map(category => (
        <Box key={category} as={motion.div} variants={staggeredFadeInUp}>
          <Checkbox
            isChecked={!!poolCategories.find(selected => selected === category)}
            onChange={e => togglePoolCategory(e.target.checked, category as PoolCategoryType)}
          >
            <Text fontSize="sm">{poolCategoryLabel(category)}</Text>
          </Checkbox>
        </Box>
      ))}
    </Box>
  )
}

function PoolTypeFilters() {
  const { togglePoolType, poolTypes, poolTypeLabel, setPoolTypes } = usePoolListQueryState()

  // remove query param when empty
  useEffect(() => {
    if (!poolTypes.length) {
      setPoolTypes(null)
    }
  }, [poolTypes])

  return (
    <Box as={motion.div} initial="hidden" animate="show" exit="exit" variants={staggeredFadeInUp}>
      {poolTypeFilters.map(poolType => (
        <Box key={poolType} as={motion.div} variants={staggeredFadeInUp}>
          <Checkbox
            isChecked={!!poolTypes.find(selected => selected === poolType)}
            onChange={e => togglePoolType(e.target.checked, poolType as PoolFilterType)}
          >
            <Text fontSize="sm" textTransform="capitalize">
              {poolTypeLabel(poolType)}
            </Text>
          </Checkbox>
        </Box>
      ))}
    </Box>
  )
}

function PoolNetworkFilters() {
  const { supportedNetworks } = getProjectConfig()
  const { networks: toggledNetworks, toggleNetwork, setNetworks } = usePoolListQueryState()

  // Sort networks alphabetically after mainnet
  const sortedNetworks = [supportedNetworks[0], ...supportedNetworks.slice(1).sort()]

  const networkOptions = sortedNetworks.map(network => ({
    label: getChainShortName(network),
    value: network,
    selectedLabel: (
      <Image src={`/images/chains/${network}.svg`} alt={network} width="20" height="20" />
    ),
  }))

  function isCheckedNetwork(network: GqlChain): boolean {
    return !!toggledNetworks.find(toggledNetwork => toggledNetwork === network)
  }

  return (
    <MultiSelect<GqlChain>
      options={networkOptions}
      isChecked={isCheckedNetwork}
      toggleOption={toggleNetwork}
      toggleAll={() => setNetworks(null)}
      label="Select networks"
    />
  )
}

function PoolMinTvlFilter() {
  const { toCurrency } = useCurrency()
  const { minTvl, setMinTvl } = usePoolListQueryState()
  const [sliderValue, setSliderValue] = useState(minTvl)

  const debounced = useDebouncedCallback((val: number) => {
    const minTvl = val > 0 ? val : null
    setMinTvl(minTvl)
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
        <Heading as="h3" size="sm" mt="sm" mb="xs">
          Minimum TVL
        </Heading>
        <Text fontSize="sm" ml="auto">
          {toCurrency(sliderValue)}
        </Text>
      </HStack>
      <Slider
        aria-label="slider-min-tvl"
        onChange={val => setSliderValue(val)}
        value={sliderValue}
        min={0}
        max={SLIDER_MAX_VALUE}
        step={SLIDER_STEP_SIZE}
        ml="sm"
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
  const {
    networks,
    toggleNetwork,
    poolTypes,
    togglePoolType,
    poolTypeLabel,
    minTvl,
    setMinTvl,
    poolCategories,
    togglePoolCategory,
    poolCategoryLabel,
  } = usePoolListQueryState()
  const { toCurrency } = useCurrency()

  if (
    networks.length === 0 &&
    poolTypes.length === 0 &&
    minTvl === 0 &&
    poolCategories.length === 0
  ) {
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
      {minTvl > 0 && (
        <Tag key="minTvl" size="lg">
          <TagLabel>
            <Text fontWeight="bold" textTransform="capitalize">
              {`TVL > ${toCurrency(minTvl)}`}
            </Text>
          </TagLabel>
          <TagCloseButton onClick={() => setMinTvl(0)} />
        </Tag>
      )}
      {poolCategories.map(poolCategory => (
        <Tag key={poolCategory} size="lg">
          <TagLabel>{poolCategoryLabel(poolCategory)}</TagLabel>
          <TagCloseButton onClick={() => togglePoolCategory(false, poolCategory)} />
        </Tag>
      ))}
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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const { resetFilters, totalFilterCount } = usePoolListQueryState()
  const { isFixedPoolType } = usePoolList()

  return (
    <VStack w="full">
      <HStack w="full" spacing="none" justify="end">
        <PoolListSearch />
        <Popover
          isOpen={isPopoverOpen}
          onOpen={() => setIsPopoverOpen(true)}
          onClose={() => setIsPopoverOpen(false)}
        >
          <PopoverTrigger>
            <FilterButton ml="sm" />
          </PopoverTrigger>
          <Box zIndex="popover" shadow="2xl">
            <PopoverContent>
              <PopoverArrow bg="background.level3" />
              <PopoverCloseButton top="sm" />
              <PopoverBody p="md">
                <AnimatePresence>
                  {isPopoverOpen && (
                    <VStack
                      align="start"
                      spacing="xxs"
                      as={motion.div}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      variants={staggeredFadeInUp}
                    >
                      <Box
                        lineHeight="0"
                        p="0"
                        mb="sm"
                        as={motion.div}
                        variants={staggeredFadeInUp}
                      >
                        <Text
                          variant="eyebrow"
                          background="font.special"
                          backgroundClip="text"
                          fontSize="xs"
                          display="inline"
                          lineHeight="1"
                        >
                          Filters
                        </Text>
                      </Box>

                      {totalFilterCount > 0 && (
                        <Button size="xs" w="full" onClick={resetFilters}>
                          Reset filters
                        </Button>
                      )}

                      {isConnected && (
                        <Box as={motion.div} variants={staggeredFadeInUp}>
                          <Heading as="h3" size="sm" my="sm">
                            My liquidity
                          </Heading>
                          <UserPoolFilter />
                        </Box>
                      )}
                      <Box as={motion.div} variants={staggeredFadeInUp} w="full">
                        <Heading as="h3" size="sm" my="sm">
                          Networks
                        </Heading>
                        <PoolNetworkFilters />
                      </Box>
                      {!isFixedPoolType && (
                        <Box as={motion.div} variants={staggeredFadeInUp}>
                          <Heading as="h3" size="sm" my="sm">
                            Pool types
                          </Heading>
                          <PoolTypeFilters />
                        </Box>
                      )}
                      <Box as={motion.div} variants={staggeredFadeInUp}>
                        <Heading as="h3" size="sm" my="sm">
                          Pool categories
                        </Heading>
                        <PoolCategoryFilters />
                      </Box>

                      <Box mb="xs" as={motion.div} variants={staggeredFadeInUp} w="full">
                        <PoolMinTvlFilter />
                      </Box>
                    </VStack>
                  )}
                </AnimatePresence>
              </PopoverBody>
            </PopoverContent>
          </Box>
        </Popover>
      </HStack>
    </VStack>
  )
}
