import { poolId, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import {
  DefaultRemoveLiquidityTestProvider,
  buildDefaultPoolTestProvider,
  testHook,
} from '@/test/utils/custom-renderers'
import { act, waitFor } from '@testing-library/react'
import { PropsWithChildren } from 'react'
import { HumanAmountIn } from '../liquidity-types'
import { useConstructRemoveLiquidityStep } from './useConstructRemoveLiquidityStep'
import { RemoveLiquidityProvider } from './useRemoveLiquidity'
// import { useRemoveLiquidityBtpInQuery } from './queries/useRemoveLiquidityBptInQuery'

const PoolProvider = buildDefaultPoolTestProvider(aWjAuraWethPoolElementMock())

export const Providers = ({ children }: PropsWithChildren) => (
  <PoolProvider>
    <RemoveLiquidityProvider>
      <DefaultRemoveLiquidityTestProvider>{children}</DefaultRemoveLiquidityTestProvider>
    </RemoveLiquidityProvider>
  </PoolProvider>
)

const wEthAmount = '1'
const wjAuraAmount = '1'
const humanAmountsIn: HumanAmountIn[] = [
  { humanAmount: wEthAmount, tokenAddress: wETHAddress },
  { humanAmount: wjAuraAmount, tokenAddress: wjAuraAddress },
]

async function testConstructRemoveLiquidityStep() {
  const { result } = testHook(() => useConstructRemoveLiquidityStep(humanAmountsIn, poolId), {
    wrapper: Providers,
  })
  return result
}

test('returns amountsIn with empty input amount by default', async () => {
  const result = await testConstructRemoveLiquidityStep()

  // User fills token inputs
  act(() => {
    result.current._setAmountIn(wETHAddress, wEthAmount)
  })

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())
  await waitFor(() => expect(result.current._lastSdkQueryOutput).toBeDefined())

  act(() => result.current.step.activateStep())

  await act(() => result.current.step?.executeAsync?.())

  await waitFor(() => expect(result.current.step.result).toBeDefined())
  await waitFor(() => expect(result.current.step.simulation.error).not.toBeNull())

  expect(result.current.step.simulation.error).toMatchInlineSnapshot(`
    [EstimateGasExecutionError: Execution reverted with reason: BAL#434.

    Estimate Gas Arguments:
      from:   0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
      to:     0xBA12222222228d8Ba445958a75a0704d566BF2C8
      value:  0 ETH
      data:   0x8bdb391368e3266c9c8bbd44ad9dca5afbfe629022aee9fe000200000000000000000512000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000198d7387fa97a73f05b8578cdeff8f2a1f34cd1f000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000015b85c3baacbc725e8000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de0b6b3a7640000

    Details: execution reverted: BAL#434
    Version: viem@1.18.1]
  `)
})
