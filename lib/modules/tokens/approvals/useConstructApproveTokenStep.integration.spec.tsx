import { vaultV2Address, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { MAX_BIGINT } from '@/lib/shared/utils/numbers'
import { defaultTestUserAccount } from '@/test/anvil/anvil-setup'
import { DefaultPoolTestProvider, testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'
import { PropsWithChildren } from 'react'
import { act } from 'react-dom/test-utils'
import { CurrentFlowStepProvider } from '../../transactions/transaction-steps/useCurrentFlowStep'
import { useTokenAllowances } from '../../web3/useTokenAllowances'
import { TokenAmountToApprove } from './approval-rules'
import { useConstructApproveTokenStep } from './useConstructApproveTokenStep'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

function Provider({ children }: PropsWithChildren) {
  return (
    <CurrentFlowStepProvider>
      <DefaultPoolTestProvider>{children}</DefaultPoolTestProvider>
    </CurrentFlowStepProvider>
  )
}

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
        spenderAddress: defaultTestUserAccount,
        tokenAllowances,
        chain: GqlChain.Mainnet,
        symbol: 'WETH',
      })
    },
    {
      wrapper: Provider,
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
