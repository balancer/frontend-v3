import { api } from '@/lib/services/api/api.client'
import {
  GqlChain,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/services/api/generated/types'

export default async function Home() {
  const { poolGetPools: pools } = await api.GetPools({
    first: 10,
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
  })

  return (
    <main>
      <ul>
        {pools.map(pool => (
          <li key={pool.id}>{pool.name}</li>
        ))}
      </ul>
    </main>
  )
}
