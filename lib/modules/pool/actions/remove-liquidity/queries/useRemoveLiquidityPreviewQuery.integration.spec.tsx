import { poolId } from '@/lib/debug-helpers'
import { testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'

import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { HumanAmount, TokenAmount } from '@balancer/sdk'
import { toHumanAmount } from '../../LiquidityActionHelpers'
import { selectRemoveLiquidityHandler } from '../handlers/selectRemoveLiquidityHandler'
import { RemoveLiquidityType } from '../remove-liquidity.types'
import { useRemoveLiquidityPreviewQuery } from './useRemoveLiquidityPreviewQuery'

async function testQuery(humanBptIn: HumanAmount) {
  const handler = selectRemoveLiquidityHandler(
    aWjAuraWethPoolElementMock(),
    RemoveLiquidityType.Proportional
  )
  const { result } = testHook(() => useRemoveLiquidityPreviewQuery(handler, poolId, humanBptIn))
  return result
}

test('runs preview query for proportional remove liquidity', async () => {
  const humanBptIn: HumanAmount = '642.164532327890776754'

  const result = await testQuery(humanBptIn)

  await waitFor(() => expect(result.current.amountsOut).toBeDefined())

  await waitFor(() => expect(result.current.amountsOut).toBeDefined())

  const wjAmountOut = result.current.amountsOut?.[0] as TokenAmount
  const wjOutUnits = toHumanAmount(wjAmountOut)
  const wethAmountOut = result.current.amountsOut?.[1] as TokenAmount
  const wethOutUnits = toHumanAmount(wethAmountOut)

  expect(Number(wjOutUnits)).toBeGreaterThan(1800)
  expect(Number(wethOutUnits)).toBeGreaterThan(0.2)
})
