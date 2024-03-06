import { getApolloServerClient } from '@/lib/shared/services/api/apollo-server.client'
import {
  GetFeaturedPoolsDocument,
  GetPoolsDocument,
} from '@/lib/shared/services/api/generated/graphql'
import { PROJECT_CONFIG, getProjectConfig } from '@/lib/config/getProjectConfig'
import { PoolList } from '@/lib/modules/pool/PoolList/PoolList'
import { PoolListProvider } from '@/lib/modules/pool/PoolList/usePoolList'
import { POOL_TYPE_MAP, poolListQueryStateParsers } from '@/lib/modules/pool/pool.types'
import { uniq } from 'lodash'
import { FeaturedPoolsProvider } from '@/lib/modules/featuredPools/useFeaturedPools'
import { VStack } from '@chakra-ui/react'
import { FeaturedPools } from '@/lib/modules/featuredPools/FeaturedPools'

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
    userAddress?: string
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

  const { supportedNetworks } = getProjectConfig()

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
  })

  const poolListFeaturedPoolsVariables = { chains: supportedNetworks }

  const { data: poolListFeaturedPoolsData } = await getApolloServerClient().query({
    query: GetFeaturedPoolsDocument,
    variables: poolListFeaturedPoolsVariables,
    context: {
      fetchOptions: {
        next: { revalidate: 30 },
      },
    },
  })

  return (
    <PoolListProvider data={poolListData} variables={poolListVariables}>
      <FeaturedPoolsProvider
        data={poolListFeaturedPoolsData}
        variables={poolListFeaturedPoolsVariables}
      >
        <VStack align="start" spacing="2xl">
          <FeaturedPools />
          <PoolList />
        </VStack>
      </FeaturedPoolsProvider>
    </PoolListProvider>
  )
}
