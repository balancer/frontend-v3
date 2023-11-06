import PoolListWrapper from '@/lib/modules/pool/PoolList/PoolListWrapper'
import { getApolloServerClient } from '@/lib/shared/services/api/apollo-server.client'
import {
  GetPoolsDocument,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/shared/services/api/generated/graphql'
import { PROJECT_CONFIG } from '@/lib/config/getProjectConfig'

export default async function Pools() {
  const { data } = await getApolloServerClient().query({
    query: GetPoolsDocument,
    variables: {
      first: 20,
      skip: 0,
      orderBy: GqlPoolOrderBy.TotalLiquidity,
      orderDirection: GqlPoolOrderDirection.Desc,
      where: {
        poolTypeIn: [
          GqlPoolFilterType.Weighted,
          GqlPoolFilterType.Stable,
          GqlPoolFilterType.PhantomStable,
          GqlPoolFilterType.MetaStable,
          GqlPoolFilterType.Gyro,
          GqlPoolFilterType.Gyro3,
          GqlPoolFilterType.Gyroe,
          GqlPoolFilterType.LiquidityBootstrapping,
        ],
        chainIn: PROJECT_CONFIG.supportedNetworks,
      },
      textSearch: null,
    },
  })

  console.log('count', data.count)

  return <PoolListWrapper data={data} />
}
