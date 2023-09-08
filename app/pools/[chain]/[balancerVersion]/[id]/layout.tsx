import { BalancerVersion } from '@/lib/modules/pool/pool.types'
import { ChainSlug, slugToChainMap } from '@/lib/modules/pool/pool.utils'
import { PoolProvider } from '@/lib/modules/pool/usePool'
import { getClient } from '@/lib/services/api/apollow-server.client'
import { GetPoolDocument } from '@/lib/services/api/generated/graphql'
import { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  params: { id: string; chain: ChainSlug; balancerVersion: BalancerVersion }
}

export default async function PoolLayout({
  params: { id, chain, balancerVersion },
  children,
}: Props) {
  const _chain = slugToChainMap[chain]

  const initPool = await getClient().query({
    query: GetPoolDocument,
    variables: { id },
  })

  return (
    <PoolProvider id={id} chain={_chain} balancerVersion={balancerVersion} initPool={initPool.data}>
      {children}
    </PoolProvider>
  )
}
