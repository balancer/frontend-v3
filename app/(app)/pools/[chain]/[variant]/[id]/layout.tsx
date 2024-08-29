/* eslint-disable max-len */
import { FetchPoolProps } from '@/lib/modules/pool/pool.types'
import { ChainSlug, getPoolTypeLabel, slugToChainMap } from '@/lib/modules/pool/pool.utils'
import { PropsWithChildren, Suspense } from 'react'
import { PoolDetailSkeleton } from '@/lib/modules/pool/PoolDetail/PoolDetailSkeleton'
import { getApolloServerClient } from '@/lib/shared/services/api/apollo-server.client'
import { GetPoolDocument } from '@/lib/shared/services/api/generated/graphql'
import { Metadata } from 'next'
import { PoolProvider } from '@/lib/modules/pool/PoolProvider'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { arrayToSentence } from '@/lib/shared/utils/strings'
import { DefaultPageContainer } from '@/lib/shared/components/containers/DefaultPageContainer'
import { BalAlert } from '@/lib/shared/components/alerts/BalAlert'
import { ensureError } from '@/lib/shared/utils/errors'

type Props = PropsWithChildren<{
  params: Omit<FetchPoolProps, 'chain'> & { chain: ChainSlug }
}>

const { projectName } = getProjectConfig()

async function getPoolQuery(chain: ChainSlug, id: string) {
  const _chain = slugToChainMap[chain]
  const variables = { id: id.toLowerCase(), chain: _chain }

  try {
    const result = await getApolloServerClient().query({
      query: GetPoolDocument,
      variables,
      context: {
        fetchOptions: {
          next: { revalidate: 30 },
        },
      },
    })
    return { data: result.data, error: null }
  } catch (error: unknown) {
    return { data: null, error: ensureError(error) }
  }
}

export async function generateMetadata({
  params: { id, chain, variant },
}: Props): Promise<Metadata> {
  const { data } = await getPoolQuery(chain, id)

  const pool = data?.pool
  if (!pool) return {}

  const poolTokenString = arrayToSentence(pool.displayTokens.map(token => token.symbol))

  return {
    title: `Liquidity Pool (${variant}): ${pool.name}`,
    description: `${pool.symbol} is a ${projectName} ${variant} ${getPoolTypeLabel(
      pool.type
    )} liquidity pool which contains ${poolTokenString}.`,
  }
}

export default async function PoolLayout({ params: { id, chain, variant }, children }: Props) {
  const _chain = slugToChainMap[chain]

  const { data, error } = await getPoolQuery(chain, id)

  if (error) {
    if (error?.message === 'Pool with id does not exist') {
      const error = `Pool with id not found in ${chain} (${id})`
      return (
        <DefaultPageContainer>
          <BalAlert status="error" content={error} ssr />
        </DefaultPageContainer>
      )
    }
    return (
      <DefaultPageContainer>
        <BalAlert
          status="warning"
          content="Our API data provider appears to be having issues..."
          ssr
        />
      </DefaultPageContainer>
    )
  }

  if (!data) return null

  return (
    <Suspense fallback={<PoolDetailSkeleton />}>
      <PoolProvider id={id} chain={_chain} variant={variant} data={data}>
        {children}
      </PoolProvider>
    </Suspense>
  )
}
