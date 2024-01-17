import { FetchPoolProps } from '@/lib/modules/pool/pool.types'
import { ChainSlug, slugToChainMap } from '@/lib/modules/pool/pool.utils'
import { PoolProvider } from '@/lib/modules/pool/usePool'
import { Box } from '@chakra-ui/react'
import { GetPoolDocument } from '@/lib/shared/services/api/generated/graphql'
import { getApolloServerClient } from '@/lib/shared/services/api/apollo-server.client'
import { PropsWithChildren } from 'react'
import { cookies } from 'next/headers'
import { COOKIE_KEYS } from '@/lib/modules/cookies/cookie.constants'

export const revalidate = 30

type Props = PropsWithChildren<{
  params: Omit<FetchPoolProps, 'chain'> & { chain: ChainSlug }
}>

export default async function PoolLayout({ params: { id, chain, variant }, children }: Props) {
  const cookieStore = cookies()
  const userAddressCookie = cookieStore.get(COOKIE_KEYS.UserAddress)
  const userAddress = userAddressCookie?.value || ''

  const _chain = slugToChainMap[chain]
  const variables = { id, chain: _chain, userAddress }

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
