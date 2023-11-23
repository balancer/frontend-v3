import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { BuildTransactionLabels } from '@/lib/modules/web3/contracts/transactionLabels'
import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { useManagedErc20Transaction } from '@/lib/modules/web3/contracts/useManagedErc20Transaction'
import { nullAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { MAX_BIGINT } from '@/lib/shared/hooks/useNumbers'
import { useEffect, useState } from 'react'
import { Address } from 'viem'

export function useConstructApproveTokenStep(tokenAddress: Address) {
  const { address: userAddress } = useUserAccount()
  const spender = useContractAddress('balancer.vaultV2')

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
      enabled: !!userAddress && !!spender,
    }
  )

  // fetch token approval and set this flag
  const hasTokenApproval = () => transaction.result.isSuccess

  const step: FlowStep = {
    ...transaction,
    getLabels: buildTokenApprovalLabels,
    stepId: 'tokenApproval',
    isComplete: hasTokenApproval(),
  }

  return {
    step,
    // setTokenApprovalArgs,
  }
}

export const buildTokenApprovalLabels: BuildTransactionLabels = () => {
  return {
    init: 'Approve token allowance',
    confirming: 'Approving token allowance',
    tooltip: 'foo',
    description: 'Token approval completed',
  }
}
