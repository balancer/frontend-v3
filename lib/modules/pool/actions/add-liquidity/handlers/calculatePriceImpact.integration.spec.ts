/**
 * Will need to be repurposed to test the price impact calc in UnbalancedAddLiquidity.handler.ts
 */

// import { balAddress, poolId, wETHAddress } from '@/lib/debug-helpers'

// import { GetPoolQuery, GqlChain } from '@/lib/shared/services/api/generated/graphql'
// import { aGqlPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
// import { testHook } from '@/test/utils/custom-renderers'
// import { ChainId, HumanAmount, PoolStateInput } from '@balancer/sdk'
// import { waitFor } from '@testing-library/react'
// import {
//   aPhantomStablePoolStateInputMock,
//   aPoolStateInputMock,
// } from '../../__mocks__/pool.builders'
// import { PoolVariant } from '../../pool.types'
// import { _usePool } from '../../usePool'
// import { HumanAmountIn } from './add-liquidity.types'
// import { NullPriceImpactAmount, calculatePriceImpact } from './calculatePriceImpact'
// import { AddLiquidityService } from './AddLiquidityService'

// function getAddLiquidityBuilder(poolStateInput: PoolStateInput) {
//   const addLiquidityBuilder = new AddLiquidityService(ChainId.MAINNET, poolStateInput, 'unbalanced')
//   return addLiquidityBuilder
// }

// test('fetches unbalanced price impact for weighted pool', async () => {
//   const poolStateInput = aPoolStateInputMock()

//   const humanAmountsIn: HumanAmountIn[] = [
//     { humanAmount: '1', tokenAddress: wETHAddress },
//     { humanAmount: '1', tokenAddress: balAddress },
//   ]

//   const priceImpact = await calculatePriceImpact(
//     getAddLiquidityBuilder(poolStateInput),
//     humanAmountsIn
//   )
//   expect(priceImpact).toMatchInlineSnapshot(`
//     PriceImpactAmount {
//       "amount": 7983577274771660n,
//       "bps": 79.8357727477166,
//       "decimal": 0.00798357727477166,
//       "percentage": 0.798357727477166,
//     }
//   `)
// })

// test('fetches unbalanced price impact for stable pool', async () => {
//   const poolStateInput = aPhantomStablePoolStateInputMock() // wstETH-rETH-sfrxETH

//   // wstETH-rETH-sfrxETH has 3 tokens + BPT token:
//   // we use 0, 10, 100, 1000 as amounts
//   const humanAmountsIn: HumanAmountIn[] = poolStateInput.tokens.map((token, i) => {
//     return {
//       humanAmount: (10 ** i).toString() as HumanAmount,
//       tokenAddress: token.address,
//     }
//   })

//   const priceImpact = await calculatePriceImpact(
//     getAddLiquidityBuilder(poolStateInput),
//     humanAmountsIn
//   )

//   expect(priceImpact).toMatchInlineSnapshot(`
//     PriceImpactAmount {
//       "amount": 6104055180098694n,
//       "bps": 61.04055180098695,
//       "decimal": 0.006104055180098694,
//       "percentage": 0.6104055180098694,
//     }
//   `)
// })

// test('returns NullPriceImpactAmount when amounts in are zero or empty', async () => {
//   const poolStateInput = aPoolStateInputMock()

//   const humanAmountsIn: HumanAmountIn[] = [
//     { humanAmount: '0', tokenAddress: wETHAddress },
//     { humanAmount: '', tokenAddress: balAddress },
//   ]

//   const priceImpact = await calculatePriceImpact(
//     getAddLiquidityBuilder(poolStateInput),
//     humanAmountsIn
//   )
//   expect(priceImpact).toEqual(NullPriceImpactAmount)
// })

// test('WITH REAL POOL FROM API', async () => {
//   const { result } = testHook(() => {
//     return _usePool({
//       id: poolId,
//       chain: GqlChain.Mainnet,
//       variant: PoolVariant.v2,
//       initialData: { pool: aGqlPoolElementMock() } as GetPoolQuery,
//     })
//   })

//   await waitFor(() => expect(result.current.loading).toBeFalsy())

//   const poolStateInput = result.current.poolStateInput

//   const humanAmountsIn: HumanAmountIn[] = [
//     {
//       tokenAddress: '0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f',
//       humanAmount: '5',
//     },
//   ]

//   const priceImpact = await calculatePriceImpact(
//     getAddLiquidityBuilder(poolStateInput),
//     humanAmountsIn
//   )
//   expect(priceImpact).toEqual(
//     expect.objectContaining({
//       amount: expect.any(BigInt),
//     })
//   )
// })
