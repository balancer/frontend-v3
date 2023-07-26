import PoolsList from '@/lib/modules/pools/components/PoolsList'
import { ApolloPageWrapper } from '@/lib/services/api/ApolloPageWrapper'
import { getApolloClient } from '@/lib/services/api/apollo.client'
import {
  GetPoolsDocument,
  GqlChain,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/services/api/generated/graphql'

export default async function Home() {
  const client = getApolloClient()
  await client.query({
    query: GetPoolsDocument,
    variables: {
      first: 10,
      skip: 0,
      orderBy: GqlPoolOrderBy.TotalLiquidity,
      orderDirection: GqlPoolOrderDirection.Desc,
      where: {
        chainNotIn: [GqlChain.Fantom, GqlChain.Optimism],
        poolTypeIn: [
          GqlPoolFilterType.Weighted,
          GqlPoolFilterType.Stable,
          GqlPoolFilterType.PhantomStable,
          GqlPoolFilterType.MetaStable,
        ],
      },
    },
  })

  return (
    <ApolloPageWrapper>
      <main className="p-4">
        <PoolsList />
      </main>
    </ApolloPageWrapper>
  )
}
