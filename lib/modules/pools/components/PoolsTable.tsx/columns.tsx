'use client'

import { ColumnDef } from '@tanstack/react-table'
import numeral from 'numeral'
import Image from 'next/image'
import { PoolsListItem } from '../../types'
import { networkConfigFor } from '@/lib/config/app.config'

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
        <div className="flex flex-col">
          <div className="text-lg font-bold">{pool.name}</div>
          <div className="flex items-center">
            {pool.displayTokens.map(
              token =>
                token.logoURI && (
                  <Image
                    src={token.logoURI}
                    key={token.address}
                    width={30}
                    height={30}
                    alt={token.symbol}
                    className="mr-1 rounded-full"
                  />
                )
            )}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'totalLiquidity',
    header: () => (
      <div className="text-right" onClick={() => console.log('sort by TVL')}>
        TVL
      </div>
    ),
    cell: ({ row }) => {
      const value = numeral(row.getValue('totalLiquidity')).format('($0,0a)')

      return <div className="text-right tabular-nums">{value}</div>
    },
  },
  {
    accessorKey: 'volume24h',
    header: () => (
      <div className="text-right" onClick={() => console.log('sort by Volume')}>
        Volume (24h)
      </div>
    ),
    cell: ({ row }) => {
      const value = numeral(row.getValue('volume24h')).format('($0,0a)')

      return <div className="text-right tabular-nums">{value}</div>
    },
  },
  {
    id: 'apr',
    accessorKey: 'apr',
    header: () => {
      return (
        <div className="text-right" onClick={() => console.log('sort by APR')}>
          APR
        </div>
      )
    },
    cell: ({ row: { original: pool } }) => {
      const apr = pool.apr
      if (!apr) {
        return <div className="text-right tabular-nums">-</div>
      }

      if (apr.min === apr.max) {
        const value = numeral(apr.min).divide(10000).format('0.[00]%')
        return <div className="text-right tabular-nums">{value}</div>
      }

      const min = numeral(apr.min).divide(10000).format('0.[00]%')
      const max = numeral(apr.max).divide(10000).format('0.[00]%')
      return <div className="text-right tabular-nums">{`${min} - ${max}`}</div>
    },
  },
]
