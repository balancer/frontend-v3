import networkConfig from '@/lib/config/networks/mainnet'
import { claimableVeBalRewardsTokens } from '@/lib/modules/portfolio/useProtocolRewards'
import { useManagedTransaction } from '@/lib/modules/web3/contracts/useManagedTransaction'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { TransactionLabels } from '@/lib/modules/transactions/transaction-steps/lib'
import { useUpdateCurrentFlowStep } from '@/lib/modules/transactions/transaction-steps/useCurrentFlowStep'

const transactionLabels: TransactionLabels = {
  init: 'Claim all',
  confirming: 'Confirming...',
  confirmed: 'Claimed',
  tooltip: 'Claim protocol revenue',
}

export function useConstructClaimVeBalRewardsStep() {
  const { userAddress } = useUserAccount()

  const claimVeBalRewardsTransaction = useManagedTransaction(
    networkConfig.contracts.feeDistributor as string,
    'balancer.feeDistributor',
    'claimTokens',
    transactionLabels,
    1, // only on mainnet
    { args: [userAddress, claimableVeBalRewardsTokens] },
    { enabled: !!userAddress }
  )

  const claimAllVeBalRewardsStep = useUpdateCurrentFlowStep({
    ...claimVeBalRewardsTransaction,
    transactionLabels,
    id: 'claimAllVeBalRewards',
    stepType: 'claim',
    isComplete: () => userAddress && claimAllVeBalRewardsStep.result.isSuccess,
  })

  return {
    claimAllVeBalRewardsStep,
  }
}
