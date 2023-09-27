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
import { usePoolList } from '@/lib/modules/pool/PoolList/usePoolList'
import { useEffect } from 'react'
import { PoolListSearch } from './PoolListSearch'
import { useProjectConfig } from '@/lib/config/useProjectConfig'
import { useTranslations } from 'next-intl'

function PoolTypeFilters() {
  const {
    setPoolTypes,
    poolFilters: { poolTypes, poolTypeFilters, mappedPoolTypes, togglePoolType, poolTypeLabel },
  } = usePoolList()

  useEffect(() => {
    setPoolTypes(mappedPoolTypes)
  }, [mappedPoolTypes, setPoolTypes])

  return poolTypeFilters.map(poolType => (
    <Checkbox
      key={poolType}
      isChecked={!!poolTypes.find(selected => selected === poolType)}
      onChange={e => togglePoolType(e.target.checked, poolType)}
    >
      <Text textTransform="capitalize">{poolTypeLabel(poolType)}</Text>
    </Checkbox>
  ))
}

function PoolNetworkFilters() {
  const { supportedNetworks } = useProjectConfig()
  const {
    setNetworks,
    poolFilters: { networks: toggledNetworks, toggleNetwork },
  } = usePoolList()

  // Set query state when toggled state changes
  useEffect(() => {
    setNetworks(toggledNetworks)
  }, [toggledNetworks, setNetworks])

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
  const {
    poolFilters: { networks, toggleNetwork, poolTypes, togglePoolType, poolTypeLabel },
  } = usePoolList()

  return (
    <HStack spacing="sm">
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

const FilterButton = forwardRef<ButtonProps & { label: string }, 'button'>((props, ref) => {
  const {
    poolFilters: { totalFilterCount },
  } = usePoolList()

  return (
    <Button ref={ref} {...props}>
      {props.label}
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
    <>
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
    </>
  )
}
