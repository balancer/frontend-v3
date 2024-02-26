import { vaultV2Address, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { buildDefaultPoolTestProvider, testHook } from '@/test/utils/custom-renderers'
import { defaultTestUserAccount } from '@/test/anvil/anvil-setup'
import { waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { useTokenAllowances } from '../../web3/useTokenAllowances'
import { useConstructApproveTokenStep } from './useConstructApproveTokenStep'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { TokenAmountToApprove } from './approval-rules'
import { MAX_BIGINT } from '@/lib/shared/utils/numbers'

function testUseConstruct() {
  const { result } = testHook(
    () => {
      const tokenAmountToApprove: TokenAmountToApprove = {
        requiredRawAmount: 40n,
        requestedRawAmount: MAX_BIGINT,
        tokenAddress: wETHAddress,
      }
      const tokenAllowances = useTokenAllowances({
        chainId: 1,
        userAddress: defaultTestUserAccount,
        spenderAddress: vaultV2Address,
        tokenAddresses: [wETHAddress, wjAuraAddress],
      })
      return useConstructApproveTokenStep({
        actionType: 'AddLiquidity',
        tokenAmountToApprove,
        chain: GqlChain.Mainnet,
        spenderAddress: defaultTestUserAccount,
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
