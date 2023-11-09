import { getApolloServerClient } from '@/lib/shared/services/api/apollo-server.client'
import { GetPoolsDocument, GetTimestampDocument } from '@/lib/shared/services/api/generated/graphql'
import { PROJECT_CONFIG } from '@/lib/config/getProjectConfig'
import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { PoolListProvider } from '@/lib/modules/pool/PoolList/usePoolList'
import { POOL_TYPE_MAP, poolListQueryStateParsers } from '@/lib/modules/pool/pool.types'
import { uniq } from 'lodash'

export const revalidate = 30

interface Props {
  searchParams: {
    first?: string
    skip?: string
    orderBy?: string
    orderDirection?: string
    poolTypes?: string
    networks?: string
    textSearch?: string
  }
}

export default async function Pools({ searchParams }: Props) {
  const poolTypes = poolListQueryStateParsers.poolTypes.parseServerSide(searchParams.poolTypes)
  const mappedPoolTypes = uniq(
    (poolTypes.length > 0 ? poolTypes : Object.keys(POOL_TYPE_MAP))
      .map(poolType => POOL_TYPE_MAP[poolType as keyof typeof POOL_TYPE_MAP])
      .flat()
  )
  const networks = poolListQueryStateParsers.networks.parseServerSide(searchParams.networks)

  const variables = {
    first: poolListQueryStateParsers.first.parseServerSide(searchParams.first),
    skip: poolListQueryStateParsers.skip.parseServerSide(searchParams.skip),
    orderBy: poolListQueryStateParsers.orderBy.parseServerSide(searchParams.orderBy),
    orderDirection: poolListQueryStateParsers.orderDirection.parseServerSide(
      searchParams.orderDirection
    ),
    where: {
      poolTypeIn: mappedPoolTypes,
      chainIn: networks.length > 0 ? networks : PROJECT_CONFIG.supportedNetworks,
    },
    textSearch: poolListQueryStateParsers.textSearch.parseServerSide(searchParams.textSearch),
  }

  const { data: tsData } = await getApolloServerClient().query({
    query: GetTimestampDocument,
  })

  const { data } = await getApolloServerClient().query({
    query: GetPoolsDocument,
    variables,
  })

  return (
    <PoolListProvider data={data} variables={variables}>
      {tsData.timestamp}
      <PoolList />
    </PoolListProvider>
  )
}
