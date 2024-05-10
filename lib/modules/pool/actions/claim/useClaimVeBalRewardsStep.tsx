import networkConfig from '@/lib/config/networks/mainnet'
import { claimableVeBalRewardsTokens } from '@/lib/modules/portfolio/PortfolioClaim/useProtocolRewards'
import { ManagedTransactionButton } from '@/lib/modules/transactions/transaction-steps/TransactionButton'
import { useTransactionState } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'
import {
  TransactionLabels,
  TransactionStep2,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { ManagedTransactionInput } from '@/lib/modules/web3/contracts/useManagedTransaction'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'
import { useMemo } from 'react'

const labels: TransactionLabels = {
  init: 'Claim all',
  title: 'Claim protocol revenue',
  confirming: 'Confirming...',
  confirmed: 'Claimed',
  tooltip: 'Claim protocol revenue',
}

export const claimVeBalRewardsStepId = 'claim-vebal-rewards'

export function useClaimVeBalRewardsStep(): TransactionStep2 {
  const { userAddress } = useUserAccount()
  const { getTransaction } = useTransactionState()

  const txSimulationMeta = sentryMetaForWagmiSimulation(
    'Error in wagmi tx simulation (Claim veBal rewards transaction)',
    {
      userAddress,
      feeDistributor: networkConfig.contracts.feeDistributor,
    }
  )

  const props: ManagedTransactionInput = {
    labels,
    chainId: 1, // only on mainnet
    contractAddress: networkConfig.contracts.feeDistributor as string,
    contractId: 'balancer.feeDistributor',
    functionName: 'claimTokens', //TODO: review ABI
    args: [userAddress, claimableVeBalRewardsTokens],
    enabled: !!userAddress,
    txSimulationMeta,
  }

  const transaction = getTransaction(claimVeBalRewardsStepId)

  const isComplete = () => userAddress && !!transaction?.result.isSuccess

  return useMemo(
    () => ({
      id: claimVeBalRewardsStepId,
      stepType: 'claim',
      labels,
      isComplete,
      renderAction: () => <ManagedTransactionButton id={claimVeBalRewardsStepId} {...props} />,
    }),
    [transaction, claimableVeBalRewardsTokens]
  )
}
