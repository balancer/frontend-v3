// import { vaultV2Address, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
// import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
// import { MAX_BIGINT } from '@/lib/shared/utils/numbers'
// import { defaultTestUserAccount } from '@/test/anvil/anvil-setup'
// import { DefaultPoolTestProvider, testHook } from '@/test/utils/custom-renderers'
// import { waitFor } from '@testing-library/react'
// import { act } from 'react-dom/test-utils'
// import { useTokenAllowances } from '../../web3/useTokenAllowances'
// import { TokenAmountToApprove } from './approval-rules'
// import { connectWithDefaultUser } from '../../../../test/utils/wagmi/wagmi-connections'

// function testUseConstruct() {
//   const { result } = testHook(
//     () => {
//       const tokenAmountToApprove: TokenAmountToApprove = {
//         requiredRawAmount: 40n,
//         requestedRawAmount: MAX_BIGINT,
//         tokenAddress: wETHAddress,
//       }

//       const tokenAllowances = useTokenAllowances({
//         chainId: 1,
//         userAddress: defaultTestUserAccount,
//         spenderAddress: vaultV2Address,
//         tokenAddresses: [wETHAddress, wjAuraAddress],
//       })

//       return useConstructApproveTokenStep({
//         actionType: 'AddLiquidity',
//         tokenAmountToApprove,
//         spenderAddress: defaultTestUserAccount,
//         tokenAllowances,
//         chain: GqlChain.Mainnet,
//         symbol: 'WETH',
//       })
//     },
//     {
//       wrapper: DefaultPoolTestProvider,
//     }
//   )
//   return result
// }

// test('Approves a token allowance', async () => {
//   await connectWithDefaultUser()
//   const result = testUseConstruct()

//   expect(result.current.transactionLabels).toMatchInlineSnapshot(`
//     {
//       "confirmed": "WETH approved!",
//       "confirming": "Approving WETH",
//       "error": "Error approving WETH",
//       "init": "Approve WETH for adding liquidity",
//       "tooltip": "You must approve WETH to add liquidity for this token on Balancer.
//     Approvals are required once per token, per wallet.",
//     }
//   `)

//   expect(result.current.id).toBe(wETHAddress)
//   await waitFor(() => expect(result.current.simulation.isSuccess).toBeTruthy())
//   await act(() => result.current.executeAsync?.())

//   await waitFor(() => expect(result.current.execution.isSuccess).toBeTruthy())
// })
