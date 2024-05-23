import { FetchPoolProps } from '@/lib/modules/pool/pool.types'
import { ChainSlug, slugToChainMap } from '@/lib/modules/pool/pool.utils'
import { PoolProvider } from '@/lib/modules/pool/PoolProvider'
import { Box } from '@chakra-ui/react'
import { GetPoolDocument } from '@/lib/shared/services/api/generated/graphql'
import { getApolloServerClient } from '@/lib/shared/services/api/apollo-server.client'
import { PropsWithChildren } from 'react'

export const revalidate = 30

type Props = PropsWithChildren<Omit<FetchPoolProps, 'chain'> & { chain: ChainSlug }>

export default async function PoolLoader({ id, chain, variant, children }: Props) {
  const _chain = slugToChainMap[chain]
  const variables = { id, chain: _chain }

  const { data } = await getApolloServerClient().query({
    query: GetPoolDocument,
    variables,
    context: {
      fetchOptions: {
        next: { revalidate: 30 },
      },
    },
  })

  if (!data.pool) {
    return <Box>Pool with id not found ({id})</Box>
  }

  return (
    <PoolProvider id={id} chain={_chain} variant={variant} data={data}>
      {children}
    </PoolProvider>
  )
}
