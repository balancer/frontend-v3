import { FetchPoolProps } from '@/lib/modules/pool/pool.types'
import { ChainSlug, slugToChainMap } from '@/lib/modules/pool/pool.utils'
import { PoolProvider } from '@/lib/modules/pool/usePool'
import { Box } from '@chakra-ui/react'
import { GetPoolDocument } from '@/lib/shared/services/api/generated/graphql'
import { getApolloServerClient } from '@/lib/shared/services/api/apollo-server.client'
import { PropsWithChildren } from 'react'
import { getNetworkConfig } from '@/lib/config/app.config'

export const revalidate = 30

type Props = PropsWithChildren<{
  params: Omit<FetchPoolProps, 'chain'> & { chain: ChainSlug }
}>

export default async function PoolLayout({ params: { id, chain, variant }, children }: Props) {
  const _chain = slugToChainMap[chain]
  const { chainId } = getNetworkConfig(_chain)
  const variables = { id, chain: _chain }

  const { data } = await getApolloServerClient().query({
    query: GetPoolDocument,
    variables,
  })

  if (!data.pool) {
    return <Box>Pool with id not found ({id})</Box>
  }

  return (
    <PoolProvider id={id} chain={_chain} variant={variant} data={data} variables={variables}>
      {children}
    </PoolProvider>
  )
}
