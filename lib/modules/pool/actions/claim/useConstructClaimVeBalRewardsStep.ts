import networkConfig from '@/lib/config/networks/mainnet'
import { claimableVeBalRewardsTokens } from '@/lib/modules/portfolio/PortfolioClaim/useProtocolRewards'
import { useManagedTransaction } from '@/lib/modules/web3/contracts/useManagedTransaction'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { TransactionLabels } from '@/lib/modules/transactions/transaction-steps/lib'
import { useSyncTransactionFlowStep } from '@/lib/modules/transactions/transaction-steps/TransactionFlowProvider'
import { captureWagmiSimulationError } from '@/lib/shared/utils/query-errors'

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
    {
      enabled: !!userAddress,
      onError(error: unknown) {
        captureWagmiSimulationError(
          error,
          'Error in wagmi tx simulation (Claim veBal rewards transaction)',
          {
            userAddress,
            feeDistributor: networkConfig.contracts.feeDistributor,
          }
        )
      },
    }
  )

  const claimAllVeBalRewardsStep = useSyncTransactionFlowStep({
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
