import { balAddress } from '@/lib/debug-helpers'
import { fakeTokenBySymbol } from '@/test/data/all-gql-tokens.fake'
import { Dictionary } from 'lodash'
import { HumanAmountIn } from '../pool/actions/liquidity-types'
import { _hasAllowance } from './useTokenAllowances'
import { parseUnits } from 'viem'

const token = fakeTokenBySymbol('BAL')

describe('checks if the user has enough allowance for a given human amount', () => {
  test('when the human amount is empty', async () => {
    const humanAmountIn: HumanAmountIn = { humanAmount: '', tokenAddress: balAddress }
    const allowancesByTokenAddress: Dictionary<bigint> = { [balAddress]: 1n }
    expect(_hasAllowance(humanAmountIn, allowancesByTokenAddress, token)).toBeTruthy()
  })

  test('when the human amount is zero', async () => {
    const humanAmountIn: HumanAmountIn = { humanAmount: '0', tokenAddress: balAddress }
    const allowancesByTokenAddress: Dictionary<bigint> = { [balAddress]: 1n }
    expect(_hasAllowance(humanAmountIn, allowancesByTokenAddress, token)).toBeTruthy()
  })

  test('when the human amount is equal to the allowance', async () => {
    const humanAmount = '2'
    const humanAmountIn: HumanAmountIn = { humanAmount, tokenAddress: balAddress }
    const allowancesByTokenAddress: Dictionary<bigint> = {
      [balAddress]: parseUnits(humanAmount, token.decimals),
    }
    expect(_hasAllowance(humanAmountIn, allowancesByTokenAddress, token)).toBeTruthy()
  })

  test('when the human amount is greater than the allowance', async () => {
    const humanAmount = '2'
    const humanAmountIn: HumanAmountIn = { humanAmount, tokenAddress: balAddress }

    const allowancesByTokenAddress: Dictionary<bigint> = {
      [balAddress]: parseUnits('1.9', token.decimals),
    }
    expect(_hasAllowance(humanAmountIn, allowancesByTokenAddress, token)).toBeFalsy()
  })

  test('when the token is undefined', async () => {
    const humanAmountIn: HumanAmountIn = { humanAmount: '0', tokenAddress: balAddress }
    const allowancesByTokenAddress: Dictionary<bigint> = { [balAddress]: 1n }

    const token = undefined
    expect(() =>
      _hasAllowance(humanAmountIn, allowancesByTokenAddress, token)
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: Token address 0xba100000625a3754423978a60c9317c58a424e3d not found when checking approvals]`
    )
  })

  test('when allowances are empty', async () => {
    const humanAmountIn: HumanAmountIn = { humanAmount: '2', tokenAddress: balAddress }
    const allowancesByTokenAddress: Dictionary<bigint> = {}

    expect(_hasAllowance(humanAmountIn, allowancesByTokenAddress, token)).toBeFalsy()
  })
})
