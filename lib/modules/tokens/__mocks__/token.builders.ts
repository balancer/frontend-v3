import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { MAX_BIGINT } from '@/lib/shared/hooks/useNumbers'
import {
  GetTokenPricesQuery,
  GetTokensQuery,
  GetTokensQueryVariables,
} from '@/lib/shared/services/api/generated/graphql'
import { fakeTokenBySymbol } from '@/test/data/all-gql-tokens.fake'
import { mock } from 'vitest-mock-extended'
import { AmountToApprove } from '../approvals/approval-rules'
import { TokenAllowances } from '../../web3/useTokenAllowances'
import { TokenAmount, TokenBase } from '../token.types'
import { MswTokenList } from './token.test.types'

export const defaultTokenMock = aTokenMock({ symbol: 'TEST-TOKEN' })
export const defaultTokenListMock: MswTokenList = [defaultTokenMock as MswTokenList[0]]

export const defaultGetTokensQueryMock: GetTokensQuery = mock<GetTokensQuery>()
export const defaultGetTokensQueryVariablesMock: GetTokensQueryVariables =
  mock<GetTokensQueryVariables>()
export const defaultGetTokenPricesQueryMock: GetTokenPricesQuery = mock<GetTokenPricesQuery>()

export function aTokenAmountMock(options?: Partial<TokenAmount>) {
  const defaultTokenAmount = {
    address: '0xc67b12049c2d0cf6e476bc64c7f82fc6c63cffc5',
    amount: 0n,
    chainId: 1,
    decimals: 8,
    formatted: '0',
  }
  return Object.assign({}, defaultTokenAmount, options)
}

export function someTokenAmountsMock(addresses: string[]) {
  return addresses.map(address => aTokenAmountMock({ address }))
}

export function aTokenMock(...options: Partial<TokenBase>[]): TokenBase {
  const defaultToken: TokenBase = fakeTokenBySymbol('BAL')
  return Object.assign({}, defaultToken, ...options)
}

export const someTokenAllowancesMock: TokenAllowances = {
  [wETHAddress]: MAX_BIGINT,
  [wjAuraAddress]: MAX_BIGINT,
}

export function anAmountToApproveMock(options: Partial<AmountToApprove>): AmountToApprove {
  const defaultAmount = { tokenAddress: wETHAddress, amount: 1n }
  return Object.assign({}, defaultAmount, options)
}
