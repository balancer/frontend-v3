import { useTokenBalances as originalUseTokenBalances } from '../useTokenBalances'
import { TokenAmount } from '../token.types'
import { fakeGqlTokens } from '@/test/data/gql-tokens.fake'
import { someTokenAmountsMock } from './token.builders'

export const defaultTokenBalances = aTokenBalancesResponse(
  someTokenAmountsMock(fakeGqlTokens.map(token => token.address))
)

let mockedResponse = aTokenBalancesResponse()

export function mockTokenBalancesResponse(mockedBalances?: TokenAmount[]) {
  mockedResponse = aTokenBalancesResponse(mockedBalances)
}

type UseTokenBalancesResponse = ReturnType<typeof originalUseTokenBalances>

function aTokenBalancesResponse(mockedBalances?: TokenAmount[]): UseTokenBalancesResponse {
  return {
    isLoading: false,
    isError: false,
    error: false,
    isRefetching: false,
    refetch: vi.fn(),
    balances: mockedBalances || [],
  }
}

export function useTokenBalances(): UseTokenBalancesResponse {
  return mockedResponse
}
