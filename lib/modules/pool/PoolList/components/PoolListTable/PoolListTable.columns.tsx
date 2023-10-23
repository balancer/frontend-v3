'use client'

import { ColumnDef } from '@tanstack/react-table'
import numeral from 'numeral'
import Image from 'next/image'
import { GqlPoolApr } from '@/lib/services/api/generated/graphql'
import { VStack, Text, HStack, Tag, Icon } from '@chakra-ui/react'
import { getNetworkConfig } from '@/lib/config/app.config'
import { PoolListItem } from '../../../pool.types'
import { getAprLabel } from '../../../pool.utils'
import { FiGlobe } from 'react-icons/fi'

const DEFAULT_WINDOW_MARGIN = 70

export const getPoolListTableColumns = (
  width: number,
  isMobile: boolean
): ColumnDef<PoolListItem>[] => {
  const innerWidth = isMobile ? 768 : width
  return [
    {
      id: 'chainLogoUrl',
      header: () => <Icon as={FiGlobe} boxSize="6" ml="1" />,
      cell: ({ row: { original: pool } }) => {
        const networkConfig = getNetworkConfig(pool.chain)
        return (
          <Image
            src={networkConfig.iconPath}
            width="30"
            height="30"
            alt={networkConfig.shortName}
          />
        )
      },
      size: Math.round((innerWidth - DEFAULT_WINDOW_MARGIN) * 0.03),
    },
    {
      id: 'details',
      header: () => <Text>Details</Text>,
      cell: ({ row: { original: pool } }) => {
        return (
          <VStack align="start">
            <Text>{pool.name}</Text>
            <HStack>
              {pool.displayTokens.map(token => (
                <Tag key={token.address}>{token.symbol}</Tag>
              ))}
            </HStack>
          </VStack>
        )
      },
      size: Math.round((innerWidth - DEFAULT_WINDOW_MARGIN) * (isMobile ? 0.55 : 0.67)),
    },
    {
      id: 'totalLiquidity',
      accessorKey: 'dynamicData.totalLiquidity',
      header: () => <Text ml="auto">TVL</Text>,
      cell: props => {
        const value = numeral(props.getValue()).format('($0,0a)')

        return (
          <Text textAlign="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {value}
          </Text>
        )
      },
      size: Math.round((innerWidth - DEFAULT_WINDOW_MARGIN) * (isMobile ? 0.14 : 0.1)),
    },
    {
      id: 'volume24h',
      accessorKey: 'dynamicData.volume24h',
      header: () => <Text ml="auto">Volume (24h)</Text>,
      cell: props => {
        const value = numeral(props.getValue()).format('($0,0a)')

        return (
          <Text textAlign="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {value}
          </Text>
        )
      },
      size: Math.round((innerWidth - DEFAULT_WINDOW_MARGIN) * (isMobile ? 0.14 : 0.1)),
    },
    {
      id: 'apr',
      accessorKey: 'dynamicData.apr',
      header: () => <Text ml="auto">APR</Text>,
      cell: row => {
        const value = row.getValue<GqlPoolApr>()
        const apr = getAprLabel(value.apr)

        return (
          <Text textAlign="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {apr}
          </Text>
        )
      },
      size: Math.round((innerWidth - DEFAULT_WINDOW_MARGIN) * (isMobile ? 0.14 : 0.1)),
    },
  ]
}
