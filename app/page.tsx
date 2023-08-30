export const dynamic = 'force-dynamic'

import PoolsPage from '@/lib/modules/pools/components/PoolsPage'
import {
  defaultPoolNetworkFilters,
  defaultPoolTypeFilters,
  getPoolNetworkArgs,
  getPoolTypeArgs,
} from '@/lib/modules/pools/hooks/usePoolFilters/pool-filters'
import {
  DEFAULT_ORDER_BY,
  DEFAULT_ORDER_DIRECTION,
  NUM_PER_PAGE,
  PAGE_NUM,
} from '@/lib/modules/pools/pool.constants'
import { getClient } from '@/lib/services/api/apollo-server.client'
import { GetPoolsDocument } from '@/lib/services/api/generated/graphql'

export default async function Home() {
  const chainIn = getPoolNetworkArgs(defaultPoolNetworkFilters)
  const poolTypeIn = getPoolTypeArgs(defaultPoolTypeFilters)

  const initPools = await getClient().query({
    query: GetPoolsDocument,
    variables: {
      first: NUM_PER_PAGE,
      skip: PAGE_NUM,
      orderBy: DEFAULT_ORDER_BY,
      orderDirection: DEFAULT_ORDER_DIRECTION,
      where: {
        chainIn,
        poolTypeIn,
      },
    },
  })

  return <PoolsPage initPools={initPools.data} />
}
