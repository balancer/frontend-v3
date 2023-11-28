import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { DefaultTokenAllowancesTestProvider, testHook } from '@/test/utils/custom-renderers'
import { testPublicClient } from '@/test/utils/wagmi'
import { waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { AmountToApprove } from './approvals'
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

function testUseTokenApprovals(amountsToApprove: AmountToApprove[]) {
  const { result } = testHook(() => useNextTokenApprovalStep(amountsToApprove), {
    wrapper: DefaultTokenAllowancesTestProvider,
  })
  return result
}

const amountsToApprove: AmountToApprove[] = [
  { tokenAddress: wETHAddress, amount: 2n },
  { tokenAddress: wjAuraAddress, amount: 2n },
]

test('useJoinApprovals', async () => {
  const result = testUseTokenApprovals(amountsToApprove)
  await waitFor(() => expect(result.current.isAllowancesLoading).toBeFalsy())

  expect(result.current.tokenApprovalStep.getLabels()).toMatchInlineSnapshot(`
    {
      "confirming": "Approving token allowance WETH",
      "description": "Token approval completed",
      "init": "Approve token allowance WETH",
      "tooltip": "foo",
    }
  `)

  act(() => result.current.tokenApprovalStep.activateStep())
  // await sleep(2000)
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

  await resetForkState()
})
