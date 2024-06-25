import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { buildTxBatch } from '@/lib/modules/transactions/transaction-steps/batchableTransactions'
import { useTransactionSteps } from '@/lib/modules/transactions/transaction-steps/useTransactionSteps'
import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { DefaultPoolTestProvider, testHook } from '@/test/utils/custom-renderers'
import { aSuccessfulQueryResultMock } from '@/test/utils/react-query'
import { act, waitFor } from '@testing-library/react'
import { mock } from 'vitest-mock-extended'
import { useSendCalls } from 'wagmi/experimental'
import { LiquidityActionHelpers } from '../LiquidityActionHelpers'
import { aTokenAmountMock } from '../__mocks__/liquidity.builders'
import { AddLiquidityHandler } from './handlers/AddLiquidity.handler'
import { AddLiquiditySimulationQueryResult } from './queries/useAddLiquiditySimulationQuery'
import { useAddLiquiditySteps } from './useAddLiquiditySteps'

const simulationQueryResult: AddLiquiditySimulationQueryResult = {
  ...mock<AddLiquiditySimulationQueryResult>(),
  ...aSuccessfulQueryResultMock(),
  data: {
    bptOut: aTokenAmountMock(wETHAddress, '10'),
  },
}

function testUseAddLiquiditySteps() {
  const { result } = testHook(
    () => {
      const { steps, isLoadingSteps } = useAddLiquiditySteps({
        helpers: new LiquidityActionHelpers(aWjAuraWethPoolElementMock()),
        handler: mock<AddLiquidityHandler>(),
        humanAmountsIn: [{ humanAmount: '10', tokenAddress: wjAuraAddress }],
        simulationQuery: {
          data: undefined,
          status: 'idle',
        } as unknown as AddLiquiditySimulationQueryResult,
      })
      const transactionSteps = useTransactionSteps(steps, isLoadingSteps)

      return { transactionSteps, isLoadingSteps, steps }
    },
    { wrapper: DefaultPoolTestProvider }
  )
  return result
}

export function testUseSendCalls() {
  const { result } = testHook(() =>
    useSendCalls({
      mutation: {
        onError: (error: unknown) => {
          console.log('Error in useSendCalls', { error })
        },
      },
    })
  )

  return result
}

test('Batches Approval and Add liquidity steps into one', async () => {
  const result1 = testUseAddLiquiditySteps()
  await waitFor(() => expect(result1.current.isLoadingSteps).toBeFalsy())

  // Approval step and add liquidity step are merged into one step
  expect(result1.current.steps.length).toBe(1)
  const steps = result1.current.transactionSteps.steps
  const addStep = steps[0]
  expect(addStep.isComplete()).toBeFalsy()
  expect(addStep?.nestedSteps?.length).toBe(1)

  // This would be done by the useTransactionSteps hook
  act(() => addStep?.onActivated?.())

  // await waitFor(() => expect(addStep.batchableTxCall).toBeDefined())

  const txBatch = buildTxBatch(addStep)
  expect(txBatch.length).toBe(2)
})
