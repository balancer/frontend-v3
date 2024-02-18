import networkConfig from '@/lib/config/networks/mainnet'
import { claimableVeBalRewardsTokens } from '@/lib/modules/portfolio/useProtocolRewards'
import { useManagedTransaction } from '@/lib/modules/web3/contracts/useManagedTransaction'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { FlowStep, TransactionLabels } from '@/lib/shared/components/btns/transaction-steps/lib'

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
    { args: [userAddress, claimableVeBalRewardsTokens] },
    { enabled: !!userAddress }
  )

  const claimAllVeBalRewardsStep: FlowStep = {
    ...claimVeBalRewardsTransaction,
    transactionLabels,
    id: 'claimAllVeBalRewards',
    stepType: 'claim',
    isComplete: () => userAddress && claimAllVeBalRewardsStep.result.isSuccess,
  }

  return {
    claimAllVeBalRewardsStep,
  }
}
