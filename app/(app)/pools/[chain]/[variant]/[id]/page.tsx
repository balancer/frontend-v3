import { FetchPoolProps } from '@/lib/modules/pool/pool.types'
import { ChainSlug, slugToChainMap } from '@/lib/modules/pool/pool.utils'
import { PoolProvider } from '@/lib/modules/pool/usePool'
import { PoolDetail } from '@/lib/modules/pool/PoolDetail/PoolDetail'
import { getApolloServerClient } from '@/lib/shared/services/api/apollo-server.client'
import { GetPoolDocument } from '@/lib/shared/services/api/generated/graphql'
import { getNetworkConfig } from '@/lib/config/app.config'

interface Props {
  params: Omit<FetchPoolProps, 'chain'> & { chain: ChainSlug }
}

export default async function PoolPage({ params: { id, chain, variant } }: Props) {
  const _chain = slugToChainMap[chain]
  const { chainId } = getNetworkConfig(_chain)

  const { data } = await getApolloServerClient().query({
    query: GetPoolDocument,
    variables: { id },
    context: { headers: { ChainId: chainId } },
  })

  return (
    <PoolProvider id={id} chain={_chain} variant={variant} pool={data}>
      <PoolDetail />
    </PoolProvider>
  )
}
