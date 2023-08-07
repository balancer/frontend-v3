'use client'

import { GqlChain, GqlPoolMinimal } from '@/lib/services/api/generated/graphql'
import { Link } from '@chakra-ui/react'
import { PoolsListItem } from '../types'

interface Props {
  pool: GqlPoolMinimal
}

export enum NetworkSlug {
  Ethereum = 'ethereum',
  Arbitrum = 'arbitrum',
  Polygon = 'polygon',
  Avalanche = 'avalanche',
  Fantom = 'fantom',
  Base = 'base',
  Optimisim = 'optimism',
  Zkevm = 'zkevm',
  Gnosis = 'gnosis',
}

export const chainToSlugMap: Record<GqlChain, NetworkSlug> = {
  [GqlChain.Mainnet]: NetworkSlug.Ethereum,
  [GqlChain.Arbitrum]: NetworkSlug.Arbitrum,
  [GqlChain.Polygon]: NetworkSlug.Polygon,
  [GqlChain.Avalanche]: NetworkSlug.Avalanche,
  [GqlChain.Fantom]: NetworkSlug.Fantom,
  [GqlChain.Base]: NetworkSlug.Base,
  [GqlChain.Optimism]: NetworkSlug.Optimisim,
  [GqlChain.Zkevm]: NetworkSlug.Zkevm,
  [GqlChain.Gnosis]: NetworkSlug.Gnosis,
}

export function getPoolPath(pool: GqlPoolMinimal | PoolsListItem) {
  return `/pools/${chainToSlugMap[pool.chain]}/v2/${pool.id}`
}

export function PoolLink({ pool, ...props }: Props) {
  return <Link href={getPoolPath(pool)} {...props} />
}
