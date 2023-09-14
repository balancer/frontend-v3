'use client'
import { BalancerVersion } from '@/lib/modules/pool/pool.types'
import { ChainSlug, slugToChainMap } from '@/lib/modules/pool/pool.utils'
import { PoolProvider, useSeedPoolCacheQuery } from '@/lib/modules/pool/usePool'
import { PoolDetail } from '@/lib/modules/pool/PoolDetail'

interface Props {
  params: { id: string; chain: ChainSlug; balancerVersion: BalancerVersion }
}

export default function PoolPage({ params: { id, chain, balancerVersion } }: Props) {
  const _chain = slugToChainMap[chain]

  useSeedPoolCacheQuery({ id, chain: _chain, balancerVersion })

  return (
    <PoolProvider id={id} chain={_chain} balancerVersion={balancerVersion}>
      <PoolDetail />
    </PoolProvider>
  )
}
