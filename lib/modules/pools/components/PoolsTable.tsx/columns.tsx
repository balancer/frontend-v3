'use client'

import { ColumnDef } from '@tanstack/react-table'
import numeral from 'numeral'
import Image from 'next/image'
import { PoolsListItem } from '../../types'
import { getNetworkConfig } from '@/lib/config/app.config'
import { GqlPoolApr, GqlPoolAprTotal } from '@/lib/services/api/generated/graphql'
import { VStack, Text, HStack } from '@chakra-ui/react'

export const getColumns = (): ColumnDef<PoolsListItem>[] => [
  {
    id: 'chainLogoUrl',
    accessorKey: 'chain.logoUrl',
    header: 'Network',
    cell: ({ row: { original: pool } }) => {
      const networkConfig = getNetworkConfig(pool.chain)
      return (
        <Image src={networkConfig.iconPath} width={30} height={30} alt={networkConfig.shortName} />
      )
    },
  },

  {
    id: 'details',
    header: 'Details',
    cell: ({ row: { original: pool } }) => {
      return (
        <VStack align="start">
          <Text>{pool.name}</Text>
          <HStack>
            {pool.displayTokens.map(
              token => (
                <Text key={token.address}>{token.address.slice(0, 6) + '... '}</Text>
              )
              // token.logoURI && (
              //   <Image
              //     src={token.logoURI}
              //     key={token.address}
              //     width={30}
              //     height={30}
              //     alt={token.symbol}
              //     className="mr-1 rounded-full"
              //   />
              // )
            )}
          </HStack>
        </VStack>
      )
    },
  },
  {
    id: 'totalLiquidity',
    accessorKey: 'dynamicData.totalLiquidity',
    header: () => (
      <Text textAlign="right" onClick={() => console.log('sort by TVL')}>
        TVL
      </Text>
    ),
    cell: props => {
      const value = numeral(props.getValue()).format('($0,0a)')

      return (
        <Text textAlign="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </Text>
      )
    },
  },
  {
    id: 'volume24h',
    accessorKey: 'dynamicData.volume24h',
    header: () => (
      <Text textAlign="right" onClick={() => console.log('sort by Volume')}>
        Volume (24h)
      </Text>
    ),
    cell: props => {
      const value = numeral(props.getValue()).format('($0,0a)')

      return (
        <Text textAlign="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {value}
        </Text>
      )
    },
  },
  {
    id: 'apr',
    accessorKey: 'dynamicData.apr',
    header: () => {
      return (
        <Text textAlign="right" onClick={() => console.log('sort by APR')}>
          APR
        </Text>
      )
    },
    cell: row => {
      const value = row.getValue<GqlPoolApr>()

      // const apr = false //pool.dynamicData.apr
      if (!(value.apr as GqlPoolAprTotal)?.total) {
        return <Text align="right">-</Text>
      }

      const apr = numeral((value.apr as GqlPoolAprTotal).total).format('0.[00]%')

      return (
        <Text textAlign="right" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {apr}
        </Text>
      )
    },
  },
]
