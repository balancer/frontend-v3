/* eslint-disable react-hooks/exhaustive-deps */
import { useManagedTransaction } from '@/lib/modules/web3/contracts/useManagedTransaction'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { TransactionLabels } from '@/lib/modules/transactions/transaction-steps/lib'
import { useEffect } from 'react'
import { useHasApprovedRelayer } from './useHasApprovedRelayer'
import { SupportedChainId } from '@/lib/config/config.types'
import { getNetworkConfig } from '@/lib/config/app.config'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'
import { useSyncTransactionFlowStep } from '../transactions/transaction-steps/TransactionFlowProvider'

export function useConstructApproveRelayerStep(chainId: SupportedChainId) {
  const { userAddress, isConnected } = useUserAccount()
  const config = getNetworkConfig(chainId)

  const relayerAddress = config.contracts.balancer.relayerV6
  const vaultAddress = config.contracts.balancer.vaultV2

  const { hasApprovedRelayer, isLoading, refetch } = useHasApprovedRelayer(chainId)

  const transactionLabels: TransactionLabels = {
    init: 'Approve relayer',
    confirming: 'Confirm relayer approval in wallet',
    tooltip: 'TODO',
    description: `🎉 Relayer Approved`,
  }

  const approveRelayerTransaction = useManagedTransaction(
    vaultAddress,
    'balancer.vaultV2',
    'setRelayerApproval',
    transactionLabels,
    chainId,
    [userAddress, relayerAddress, true],
    {
      query: {
        enabled: !!userAddress && !isLoading,
        meta: sentryMetaForWagmiSimulation('Error in wagmi tx simulation: Approving Relayer', {
          vaultAddress,
          userAddress,
          relayerAddress,
          chainId,
        }),
      },
    }
  )

  const step = useSyncTransactionFlowStep({
    ...approveRelayerTransaction,
    transactionLabels,
    id: 'approveBatchRelayer',
    stepType: 'approveBatchRelayer',
    isComplete: () => isConnected && hasApprovedRelayer,
  })

  useEffect(() => {
    if (approveRelayerTransaction.result.isSuccess) refetch()
  }, [approveRelayerTransaction.result.isSuccess])

  return step
}
