/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { vaultV2Address, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { MAX_BIGINT } from '@/lib/shared/utils/numbers'
import { defaultTestUserAccount } from '@/test/anvil/anvil-setup'
import { testHook } from '@/test/utils/custom-renderers'
import { act, waitFor } from '@testing-library/react'
import { Address, parseUnits } from 'viem'
import { useSendCalls } from 'wagmi/experimental'
import { BPT_DECIMALS } from '../../pool/pool.constants'
import { useTokenAllowances } from '../../web3/useTokenAllowances'
import { useTokenApprovalSteps } from './useTokenApprovalSteps'

function testUseSteps() {
  const { result } = testHook(() => {
    return useTokenApprovalSteps({
      chain: GqlChain.Mainnet,
      spenderAddress: vaultV2Address,
      actionType: 'AddLiquidity',
      approvalAmounts: [
        { address: wETHAddress, rawAmount: parseUnits('10', BPT_DECIMALS) },
        { address: wjAuraAddress, rawAmount: parseUnits('20', BPT_DECIMALS) },
      ],
    })
  })
  return result
}

export function testTokenAllowances(tokenAddresses: Address[]) {
  const { result } = testHook(() =>
    useTokenAllowances({
      chainId: 1,
      userAddress: defaultTestUserAccount,
      spenderAddress: vaultV2Address,
      tokenAddresses,
    })
  )
  return result
}

export function testUseSendCalls() {
  const { result } = testHook(() =>
    useSendCalls({
      mutation: {
        onError: () => {
          console.log('Error in useSendCalls')
        },
      },
    })
  )

  return result
}

test('Approves 2 token allowances in an atomic transaction batch', async () => {
  const result1 = testUseSteps()

  const tokenAllowances = testTokenAllowances([wETHAddress, wjAuraAddress])

  expect(tokenAllowances.current.allowanceFor(wETHAddress)).toBe(0n)
  expect(tokenAllowances.current.allowanceFor(wjAuraAddress)).toBe(0n)

  const calls = result1.current.steps.map(step => step.batchableTxCall!)

  const sendCallsResult = testUseSendCalls()

  sendCallsResult.current.sendCalls({
    chainId: 1,
    calls,
  })

  await waitFor(() => expect(sendCallsResult.current.isSuccess).toBeTruthy())

  await act(tokenAllowances.current.refetchAllowances)
  expect(tokenAllowances.current.allowanceFor(wETHAddress)).toBe(MAX_BIGINT)
  expect(tokenAllowances.current.allowanceFor(wjAuraAddress)).toBe(MAX_BIGINT)
})
