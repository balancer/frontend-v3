import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import {
  LiquidityActionHelpers,
  areEmptyAmounts,
  shouldUseNestedLiquidity,
  shouldUseRecoveryRemoveLiquidity,
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
import { recoveryPoolMock } from '../__mocks__/recoveryPoolMock'
import { Pool } from '../usePool'
import { mock } from 'vitest-mock-extended'

describe('areEmptyAmounts', () => {
  test('when all humanAmounts are empty, zero or zero with decimals', () => {
    const humanAmountsIn: HumanAmountIn[] = [
      { tokenAddress: '0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f', humanAmount: '' },
      { tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', humanAmount: '0' },
      { tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756bb3', humanAmount: '0.00' },
    ]
    expect(areEmptyAmounts(humanAmountsIn)).toBeTruthy()
  })

  test('when  humanAmounts is an empty array', () => {
    const humanAmountsIn: HumanAmountIn[] = []
    expect(areEmptyAmounts(humanAmountsIn)).toBeTruthy()
  })
})

test('detects pools requiring nested liquidity', () => {
  expect(shouldUseNestedLiquidity(aWjAuraWethPoolElementMock())).toBeFalsy()
  expect(shouldUseNestedLiquidity(nestedPoolMock)).toBeTruthy()
})

describe('detects pools requiring recovery removal', () => {
  test('when the pool is in recovery and paused', () => {
    const pausedAndInRecoveryPool: Pool = mock<Pool>({
      dynamicData: { isInRecoveryMode: true, isPaused: true },
    })
    expect(shouldUseRecoveryRemoveLiquidity(pausedAndInRecoveryPool)).toBeTruthy()
  })

  test('when the pool is in recovery and affected by CSP', () => {
    expect(shouldUseRecoveryRemoveLiquidity(recoveryPoolMock)).toBeTruthy()
  })
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
