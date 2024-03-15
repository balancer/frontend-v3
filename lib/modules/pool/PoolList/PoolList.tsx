import { getApolloServerClient } from '@/lib/shared/services/api/apollo-server.client'
import { GetPoolsDocument } from '@/lib/shared/services/api/generated/graphql'
import { PROJECT_CONFIG } from '@/lib/config/getProjectConfig'
import { PoolListProvider } from '@/lib/modules/pool/PoolList/usePoolList'
import {
  POOL_TYPE_MAP,
  PoolSearchParams,
  poolListQueryStateParsers,
} from '@/lib/modules/pool/pool.types'
import { uniq } from 'lodash'
import { PoolListLayout } from './PoolListLayout'

export const revalidate = 30

interface Props {
  searchParams: PoolSearchParams
}

export async function PoolList({ searchParams }: Props) {
  const poolTypes = poolListQueryStateParsers.poolTypes.parseServerSide(searchParams.poolTypes)
  const mappedPoolTypes = uniq(
    (poolTypes.length > 0 ? poolTypes : Object.keys(POOL_TYPE_MAP))
      .map(poolType => POOL_TYPE_MAP[poolType as keyof typeof POOL_TYPE_MAP])
      .flat()
  )
  const networks = poolListQueryStateParsers.networks.parseServerSide(searchParams.networks)

  const poolListVariables = {
    first: poolListQueryStateParsers.first.parseServerSide(searchParams.first),
    skip: poolListQueryStateParsers.skip.parseServerSide(searchParams.skip),
    orderBy: poolListQueryStateParsers.orderBy.parseServerSide(searchParams.orderBy),
    orderDirection: poolListQueryStateParsers.orderDirection.parseServerSide(
      searchParams.orderDirection
    ),
    where: {
      poolTypeIn: mappedPoolTypes,
      chainIn: networks.length > 0 ? networks : PROJECT_CONFIG.supportedNetworks,
      userAddress: poolListQueryStateParsers.userAddress.parseServerSide(searchParams.userAddress),
    },
    textSearch: poolListQueryStateParsers.textSearch.parseServerSide(searchParams.textSearch),
  }

  const { data: poolListData } = await getApolloServerClient().query({
    query: GetPoolsDocument,
    variables: poolListVariables,
    context: {
      fetchOptions: {
        next: { revalidate: 30 },
      },
    },
  })

  return (
    <PoolListProvider data={poolListData}>
      <PoolListLayout />
    </PoolListProvider>
  )
}
