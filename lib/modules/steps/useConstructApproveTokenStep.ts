import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { BuildTransactionLabels } from '@/lib/modules/web3/contracts/transactionLabels'
import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { useManagedErc20Transaction } from '@/lib/modules/web3/contracts/useManagedErc20Transaction'
import { nullAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { MAX_BIGINT } from '@/lib/shared/hooks/useNumbers'
import { useEffect, useState } from 'react'
import { Address } from 'viem'
import { useUserTokenAllowance } from '../web3/useUserTokenAllowance'
import { vaultV2Address, wETHAddress } from '@/lib/debug-helpers'
import { useActiveStep } from './useActiveStep'

export function useConstructApproveTokenStep(tokenAddress: Address) {
  const { address: userAddress } = useUserAccount()
  const { isActiveStep, activateStep } = useActiveStep()
  const spender = useContractAddress('balancer.vaultV2')

  // TODO: Pass allowances from outside
  const { allowance, isLoadingAllowance } = useUserTokenAllowance(tokenAddress, vaultV2Address)

  const [tokenApprovalArgs, setTokenApprovalArgs] = useState<[Address, bigint]>([
    spender || nullAddress,
    0n,
  ])

  // update token approval args
  useEffect(() => {
    if (userAddress && spender) {
      setTokenApprovalArgs([spender, MAX_BIGINT])
    }
  }, [userAddress, spender])

  const transaction = useManagedErc20Transaction(
    tokenAddress,
    'approve',
    buildTokenApprovalLabels(),
    { args: tokenApprovalArgs },
    {
      enabled: isActiveStep && !!spender && !isLoadingAllowance,
    }
  )
  const hasTokenApproval = () => {
    return transaction.result.isSuccess || allowance === MAX_BIGINT //TODO: This will depend on the allowance amount set by the user
  } //TODO: This will depend on the allowance amount set by the user

  const step: FlowStep = {
    ...transaction,
    getLabels: () => buildTokenApprovalLabels(tokenAddress), //TODO: avoid callback type and accept result instead??
    id: tokenAddress,
    stepType: 'tokenApproval',
    isComplete: hasTokenApproval,
    activateStep,
  }

  return {
    step,
    // setTokenApprovalArgs,
  }
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
