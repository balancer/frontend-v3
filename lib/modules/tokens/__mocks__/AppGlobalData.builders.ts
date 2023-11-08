import { GetAppGlobalDataQuery, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { fakeTokenBySymbol } from '@/test/data/all-gql-tokens.fake'

export function anAppGlobalData(options?: Partial<GetAppGlobalDataQuery>) {
  const defaultAppGlobalData: GetAppGlobalDataQuery = {
    blocksGetAverageBlockTime: 1000,
    blocksGetBlocksPerDay: 100,
    tokenGetTokens: [fakeTokenBySymbol('BAL') as GqlToken, fakeTokenBySymbol('ETH') as GqlToken],
  }
  return Object.assign({}, defaultAppGlobalData, options)
}
