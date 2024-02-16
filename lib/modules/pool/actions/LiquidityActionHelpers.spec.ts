import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import {
  LiquidityActionHelpers,
  hasValidHumanAmounts,
  shouldUseNestedLiquidity,
} from './LiquidityActionHelpers'
import { HumanAmountIn } from './liquidity-types'
import { nestedPoolMock } from '../__mocks__/nestedPoolMock'
import {
  bpt3PoolAddress,
  wETHAddress,
  threePoolId,
  daiAddress,
  usdcAddress,
  usdtAddress,
} from '@/lib/debug-helpers'
import { gyroPoolMock } from '../__mocks__/gyroPoolMock'

describe('hasValidHumanAmounts', () => {
  test('when all humanAmounts are empty', () => {
    const humanAmountsIn: HumanAmountIn[] = [
      { tokenAddress: '0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f', humanAmount: '' },
      { tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', humanAmount: '' },
    ]
    expect(hasValidHumanAmounts(humanAmountsIn)).toBeFalsy()
  })
  test('when all humanAmounts are zero', () => {
    const humanAmountsIn: HumanAmountIn[] = [
      { tokenAddress: '0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f', humanAmount: '0' },
      { tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', humanAmount: '0' },
    ]
    expect(hasValidHumanAmounts(humanAmountsIn)).toBeFalsy()
  })
  test('when  humanAmounts is an empty array', () => {
    const humanAmountsIn: HumanAmountIn[] = []
    expect(hasValidHumanAmounts(humanAmountsIn)).toBeFalsy()
  })
})

test('detects pools requiring nested liquidity', () => {
  expect(shouldUseNestedLiquidity(aWjAuraWethPoolElementMock())).toBeFalsy()
  expect(shouldUseNestedLiquidity(nestedPoolMock)).toBeTruthy()
})

it('returns poolState for non nested pools', () => {
  const poolMock = aWjAuraWethPoolElementMock()
  const helpers = new LiquidityActionHelpers(aWjAuraWethPoolElementMock())
  expect(helpers.poolState.id).toBe(poolMock.id)
})

it('returns NestedPoolState for nested pools', () => {
  const helpers = new LiquidityActionHelpers(nestedPoolMock)
  const nestedPoolState = helpers.nestedPoolState

  expect(nestedPoolState.pools).toHaveLength(2)
  const firstPool = nestedPoolState.pools[0]
  expect(firstPool.id).toBe(nestedPoolMock.id)
  expect(firstPool.tokens.map(t => t.address)).toEqual([bpt3PoolAddress, wETHAddress])

  const secondPool = nestedPoolState.pools[1]
  expect(secondPool.id).toBe(threePoolId)
  expect(secondPool.tokens.map(t => t.address)).toEqual([
    daiAddress,
    bpt3PoolAddress,
    usdcAddress,
    usdtAddress,
  ])

  expect(nestedPoolState.mainTokens).toHaveLength(4)
  expect(nestedPoolState.mainTokens.map(t => t.address)).toEqual([
    wETHAddress,
    daiAddress,
    usdtAddress,
    usdcAddress,
  ])
})

describe('calculates and sorts proportional human amounts in', () => {
  const usdcAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174'
  const daiAddress = '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'

  it('given a new human amount for the first token (USDC)', () => {
    const helpers = new LiquidityActionHelpers(gyroPoolMock)

    const humanAmountsIn = helpers.calculateProportionalHumanAmountsIn(usdcAddress, '100')

    expect(humanAmountsIn).toEqual([
      {
        tokenAddress: usdcAddress,
        humanAmount: '100',
      },
      {
        tokenAddress: daiAddress,
        humanAmount: '93.571836178454023742',
      },
    ])
  })

  it('given a new human amount for the second token (DAI)', () => {
    const helpers = new LiquidityActionHelpers(gyroPoolMock)

    const humanAmountsIn = helpers.calculateProportionalHumanAmountsIn(daiAddress, '50')

    // Sorts the results moving DAI human amount to the first position
    expect(humanAmountsIn).toEqual([
      {
        tokenAddress: daiAddress,
        humanAmount: '50',
      },
      {
        tokenAddress: usdcAddress,
        humanAmount: '53.434881',
      },
    ])
  })
})
