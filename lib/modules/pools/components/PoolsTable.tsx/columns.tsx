'use client'

import { ColumnDef } from '@tanstack/react-table'
import numeral from 'numeral'
import Image from 'next/image'
import { PoolsListItem } from '../../types'
import { networkConfigFor } from '@/lib/config/app.config'
import { Text } from '@/components/_base/Text'
import { VStack } from '@/components/_base/VStack'
import { HStack } from '@/components/_base/HStack'
import { GqlPoolApr, GqlPoolAprTotal } from '@/lib/services/api/generated/types'

export const getColumns = (): ColumnDef<PoolsListItem>[] => [
  {
    id: 'chainLogoUrl',
    accessorKey: 'chain.logoUrl',
    header: 'Network',
    cell: ({ row: { original: pool } }) => {
      const networkConfig = networkConfigFor(pool.chain)
      return (
        <Image
          src={networkConfig.iconPath}
          width={30}
          height={30}
          alt={networkConfig.shortName}
        />
      )
    },
  },

  {
    id: 'details',
    header: 'Details',
    cell: ({ row: { original: pool } }) => {
      return (
        <VStack>
          <Text weight="bold" size="lg">
            {pool.name}
          </Text>
          <HStack align="center">
            {pool.displayTokens.map(
              token => token.address.slice(0, 6) + '... '
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
      <Text align="right" onClick={() => console.log('sort by TVL')}>
        TVL
      </Text>
    ),
    cell: props => {
      const value = numeral(props.getValue()).format('($0,0a)')

      return (
        <Text align="right" numeric="tabular">
          {value}
        </Text>
      )
    },
  },
  {
    id: 'volume24h',
    accessorKey: 'dynamicData.volume24h',
    header: () => (
      <Text align="right" onClick={() => console.log('sort by Volume')}>
        Volume (24h)
      </Text>
    ),
    cell: props => {
      const value = numeral(props.getValue()).format('($0,0a)')

      return (
        <Text align="right" numeric="tabular">
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
        <Text align="right" onClick={() => console.log('sort by APR')}>
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

      const apr = numeral((value.apr as GqlPoolAprTotal).total).format(
        '0.[00]%'
      )

      return (
        <Text align="right" numeric="tabular">
          {apr}
        </Text>
      )
    },
  },
]
