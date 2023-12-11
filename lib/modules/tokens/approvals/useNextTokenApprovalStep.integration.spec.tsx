import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { DefaultTokenAllowancesTestProvider, testHook } from '@/test/utils/custom-renderers'
import { testPublicClient } from '@/test/utils/wagmi'
import { waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { TokenAmountToApprove } from './approval-rules'
import { useNextTokenApprovalStep } from './useNextTokenApprovalStep'

//TODO: Extract to helper
async function resetForkState() {
  await act(async () => {
    // Save this as an example
    // const utils = await getSdkTestUtils({ poolId })
    // await utils.setupToken('0', wETHAddress)
    // await utils.setupToken('0', wjAuraAddress)
    await testPublicClient.reset()
  })
}

function testUseTokenApprovals(amountsToApprove: TokenAmountToApprove[]) {
  const { result } = testHook(() => useNextTokenApprovalStep(amountsToApprove), {
    wrapper: DefaultTokenAllowancesTestProvider,
  })
  return result
}

const amountsToApprove: TokenAmountToApprove[] = [
  { tokenAddress: wETHAddress, rawAmount: 2n, humanAmount: '2', tokenSymbol: 'WETH' },
  { tokenAddress: wjAuraAddress, rawAmount: 2n, humanAmount: '2', tokenSymbol: 'wjAura' },
]

// Unskip once we refactor tests state to be isolated
test.skip('useNextTokenApprovalStep builds 2 sequential token approval steps', async () => {
  await resetForkState()

  const result = testUseTokenApprovals(amountsToApprove)
  await waitFor(() => expect(result.current.isAllowancesLoading).toBeFalsy())

  expect(result.current.tokenApprovalStep.transactionLabels).toMatchInlineSnapshot(`
    {
      "confirming": "Approving WETH",
      "description": "Token WETH approval completed",
      "init": "Approve WETH for adding liquidity",
      "tooltip": "You must approve WETH to add liquidity for this token on Balancer.
    Approvals are required once per token, per wallet.",
    }
  `)

  act(() => result.current.tokenApprovalStep.activateStep())
  console.log(result.current.tokenApprovalStep.simulation.isIdle)
  await waitFor(() => expect(result.current.tokenApprovalStep.simulation.isSuccess).toBeTruthy())
  await act(() => result.current.tokenApprovalStep.executeAsync?.())

  expect(result.current.tokenApprovalStep.id).toBe(wETHAddress)
  expect(result.current.tokenApprovalStep.isComplete()).toBeFalsy()

  await waitFor(() => expect(result.current.tokenApprovalStep.id).toBe(wjAuraAddress))
  expect(result.current.tokenApprovalStep.isComplete()).toBeFalsy()

  // Second approval simulation
  await waitFor(() => expect(result.current.tokenApprovalStep.simulation.isSuccess).toBeTruthy())
  await act(() => result.current.tokenApprovalStep.executeAsync?.())

  await waitFor(() => expect(result.current.tokenApprovalStep.isComplete()).toBeFalsy())
})
