'use client'
import { FetchPoolProps } from '@/lib/modules/pool/pool.types'
import { ChainSlug, slugToChainMap } from '@/lib/modules/pool/pool.utils'
import { PoolProvider, useSeedPoolCacheQuery } from '@/lib/modules/pool/usePool'
import { PoolDetail } from '@/lib/modules/pool/PoolDetail/PoolDetail'
import { Box, Text } from '@chakra-ui/react'

interface Props {
  params: Omit<FetchPoolProps, 'chain'> & { chain: ChainSlug }
}

export default function PoolPage({ params: { id, chain, variant } }: Props) {
  const _chain = slugToChainMap[chain]

  useSeedPoolCacheQuery({ id, chain: _chain, variant })

  return (
    <PoolProvider id={id} chain={_chain} variant={variant}>
      <PoolDetail />
    </PoolProvider>
  )
}
