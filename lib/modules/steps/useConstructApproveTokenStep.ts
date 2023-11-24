/* eslint-disable react-hooks/exhaustive-deps */
import { wETHAddress } from '@/lib/debug-helpers'
import { BuildTransactionLabels } from '@/lib/modules/web3/contracts/transactionLabels'
import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { useManagedErc20Transaction } from '@/lib/modules/web3/contracts/useManagedErc20Transaction'
import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { MAX_BIGINT } from '@/lib/shared/hooks/useNumbers'
import { Address } from 'viem'
import { useActiveStep } from './useActiveStep'
import { useTokenAllowances } from '../web3/useTokenAllowances'
import { useEffect } from 'react'

export function useConstructApproveTokenStep(tokenAddress: Address, amountToAllow: bigint) {
  const { isActiveStep, activateStep } = useActiveStep()
  const spender = useContractAddress('balancer.vaultV2')
  const { refetchAllowances, allowances, isAllowancesLoading } = useTokenAllowances()

  const approvalTransaction = useManagedErc20Transaction(
    tokenAddress,
    'approve',
    buildTokenApprovalLabels(),
    { args: [spender || emptyAddress, MAX_BIGINT] }, //By default we set MAX_BIGINT
    {
      enabled: isActiveStep && !!spender && !isAllowancesLoading && !!amountToAllow,
    }
  )

  const hasTokenApproval = () => {
    return approvalTransaction.result.isSuccess || allowances[tokenAddress] > amountToAllow //TODO: We need to include slippage in this calculation
  }

  useEffect(() => {
    // refetch allowances after the approval transaction was executed
    if (approvalTransaction.result.isSuccess) {
      refetchAllowances()
    }
  }, [approvalTransaction.result.isSuccess])

  const step: FlowStep = {
    ...approvalTransaction,
    getLabels: () => buildTokenApprovalLabels(tokenAddress), //TODO: avoid callback type and accept result instead??
    id: tokenAddress,
    stepType: 'tokenApproval',
    isComplete: hasTokenApproval,
    activateStep,
  }

  return step
}

export const buildTokenApprovalLabels: BuildTransactionLabels = tokenAddress => {
  //TODO: refactor
  const tokenSymbol = tokenAddress === wETHAddress ? 'WETH' : 'wjAura'
  return {
    init: `Approve token allowance ${tokenSymbol}`,
    confirming: `Approving token allowance ${tokenSymbol}`,
    tooltip: 'foo',
    description: 'Token approval completed',
  }
}
