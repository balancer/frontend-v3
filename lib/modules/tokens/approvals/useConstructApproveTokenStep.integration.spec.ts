import { vaultV2Address, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { buildDefaultPoolTestProvider, testHook } from '@/test/utils/custom-renderers'
import { defaultTestUserAccount, testPublicClient } from '@/test/utils/wagmi'
import { waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { useTokenAllowances } from '../../web3/useTokenAllowances'
import { useConstructApproveTokenStep } from './useConstructApproveTokenStep'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

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

function testUseConstruct() {
  const { result } = testHook(
    () => {
      const tokenAllowances = useTokenAllowances(defaultTestUserAccount, vaultV2Address, [
        wETHAddress,
        wjAuraAddress,
      ])
      return useConstructApproveTokenStep({
        actionType: 'AddLiquidity',
        tokenAddress: wETHAddress,
        chain: GqlChain.Mainnet,
        spenderAddress: defaultTestUserAccount,
        amountToApprove: 40n,
        tokenAllowances,
      })
    },
    {
      wrapper: buildDefaultPoolTestProvider(),
    }
  )
  return result
}

test('Approves a token allowance', async () => {
  await resetForkState()

  const result = testUseConstruct()

  expect(result.current.transactionLabels).toMatchInlineSnapshot(`
    {
      "confirming": "Approving WETH",
      "description": "Token WETH approval completed",
      "init": "Approve WETH for adding liquidity",
      "tooltip": "You must approve WETH to add liquidity for this token on Balancer.
    Approvals are required once per token, per wallet.",
    }
  `)

  expect(result.current.id).toBe(wETHAddress)
  await waitFor(() => expect(result.current.simulation.isSuccess).toBeTruthy())
  await act(() => result.current.executeAsync?.())

  await waitFor(() => expect(result.current.execution.isSuccess).toBeTruthy())
})
