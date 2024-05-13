import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { defaultTestUserAccount } from '@/test/anvil/anvil-setup'
import { DefaultPoolTestProvider, testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { connectWithDefaultUser } from '../../../../test/utils/wagmi/wagmi-connections'
import { useManagedErc20Transaction } from '../../web3/contracts/useManagedErc20Transaction'
import { useTokenApprovalSteps } from './useTokenApprovalSteps'

function testSteps() {
  const { result } = testHook(
    () => {
      return useTokenApprovalSteps({
        spenderAddress: defaultTestUserAccount,
        chain: GqlChain.Mainnet,
        approvalAmounts: [
          { address: wETHAddress, rawAmount: 40n },
          { address: wjAuraAddress, rawAmount: 40n },
        ],
        actionType: 'AddLiquidity',
      })
    },
    {
      wrapper: DefaultPoolTestProvider,
    }
  )
  return result
}

function firstStepProps(result: ReturnType<typeof testSteps>) {
  return result.current.steps[0]?._props
}

test('Approves a token allowance', async () => {
  await connectWithDefaultUser()
  const stepsResult = testSteps()

  expect(firstStepProps(stepsResult).labels).toMatchInlineSnapshot(`
    {
      "confirmed": "WETH approved!",
      "confirming": "Approving WETH",
      "error": "Error approving WETH",
      "init": "Approve WETH for adding liquidity",
      "title": "Approve WETH",
      "tooltip": "You must approve WETH to add liquidity for this token on Balancer.
    Approvals are required once per token, per wallet.",
    }
  `)

  await waitFor(() => expect(firstStepProps(stepsResult).enabled).toBeTruthy())

  const { result } = testHook(() => useManagedErc20Transaction(firstStepProps(stepsResult)))

  await waitFor(() => expect(result.current.simulation.isSuccess).toBeTruthy())

  await act(() => result.current.executeAsync?.())

  await waitFor(() => expect(result.current.execution.isSuccess).toBeTruthy())
})
