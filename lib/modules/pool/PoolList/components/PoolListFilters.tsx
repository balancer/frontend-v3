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
import { useProjectConfig } from '@/lib/config/useProjectConfig'
import { useTranslations } from 'next-intl'
import {
  PoolTypeKey,
  usePoolListQueryState,
} from '@/lib/modules/pool/PoolList/usePoolListQueryState'

function PoolTypeFilters() {
  const { togglePoolType, poolTypeFilters, poolTypes, poolTypeLabel } = usePoolListQueryState()

  return poolTypeFilters.map(poolType => (
    <Checkbox
      key={poolType}
      isChecked={!!poolTypes.find(selected => selected === poolType)}
      onChange={e => togglePoolType(e.target.checked, poolType as PoolTypeKey)}
    >
      <Text textTransform="capitalize">{poolTypeLabel(poolType)}</Text>
    </Checkbox>
  ))
}

function PoolNetworkFilters() {
  const { supportedNetworks } = useProjectConfig()
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
  const { totalFilterCount } = usePoolListQueryState()

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
