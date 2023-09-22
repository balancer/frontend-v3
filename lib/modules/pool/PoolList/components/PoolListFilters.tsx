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
import { usePoolList } from '@/lib/modules/pool/PoolList/usePoolList'
import { useEffect } from 'react'
import { PoolFiltersProvider, usePoolListFilters } from '../usePoolListFilters'
import { PoolListSearch } from './PoolListSearch'
import { useTranslations } from 'next-intl'

function PoolTypeFilters() {
  const {
    poolTypes,
    poolTypeFilters,
    addPoolTypeFilter,
    removePoolTypeFilter,
    mappedPoolTypes,
    labelFor,
  } = usePoolListFilters()
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
      <Text textTransform="capitalize">{labelFor(poolType)}</Text>
    </Checkbox>
  ))
}

function PoolNetworkFilters() {
  const { networks, networkFilters, addNetworkFilter, removeNetworkFilter } = usePoolListFilters()
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
  const { poolTypes, networks, removePoolTypeFilter, removeNetworkFilter, labelFor } =
    usePoolListFilters()

  return (
    <HStack spacing="sm">
      {poolTypes.map(poolType => (
        <Tag key={poolType}>
          <TagLabel>{labelFor(poolType)}</TagLabel>
          <TagCloseButton onClick={() => removePoolTypeFilter(poolType)} />
        </Tag>
      ))}

      {networks.map(network => (
        <Tag key={network}>
          <TagLabel>
            <Text textTransform="capitalize">{network.toLowerCase()}</Text>
          </TagLabel>
          <TagCloseButton onClick={() => removeNetworkFilter(network)} />
        </Tag>
      ))}
    </HStack>
  )
}

const FilterButton = forwardRef<ButtonProps & { buttonText: string }, 'button'>((props, ref) => {
  const { totalFilterCount } = usePoolListFilters()

  return (
    <Button ref={ref} {...props}>
      {props.buttonText}
      {totalFilterCount > 0 && (
        <Badge ml="2" colorScheme="blue">
          {totalFilterCount}
        </Badge>
      )}
    </Button>
  )
})

export function PoolListFilters() {
  const t = useTranslations('PoolListFilters')

  return (
    <PoolFiltersProvider>
      <HStack>
        <Popover>
          <PopoverTrigger>
            <FilterButton label={t('label')} />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <VStack align="start">
                <Heading as="h3" size="sm">
                  {t('poolTypes')}
                </Heading>
                <PoolTypeFilters />
                <Divider />
                <Heading as="h3" size="sm">
                  {t('networks')}
                </Heading>
                <PoolNetworkFilters />
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <PoolListSearch />
      </HStack>
      <FilterTags />
    </PoolFiltersProvider>
  )
}
