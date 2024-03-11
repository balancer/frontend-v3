/* eslint-disable react-hooks/exhaustive-deps */
import { TransactionLabels } from '@/lib/modules/transactions/transaction-steps/lib'
import { useManagedTransaction } from '@/lib/modules/web3/contracts/useManagedTransaction'
import { getChainId, getNetworkConfig } from '@/lib/config/app.config'
import { useHasMinterApproval } from './useHasMinterApproval'
import { useEffect } from 'react'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { useUpdateCurrentFlowStep } from '../../transactions/transaction-steps/useCurrentFlowStep'

export function useConstructMinterApprovalStep(chain: GqlChain) {
  const { isConnected } = useUserAccount()
  const networkConfig = getNetworkConfig(chain)

  const { hasMinterApproval, isLoading, refetch } = useHasMinterApproval()

  const transactionLabels: TransactionLabels = {
    init: 'Approve relayer as minter',
    confirming: 'Confirming...',
    confirmed: `Relayer approved as minter!`,
    tooltip: 'TODO TOOLTIP',
  }

  const minterApprovalTransaction = useManagedTransaction(
    networkConfig.contracts.balancer.minter,
    'balancer.minter',
    'setMinterApproval',
    transactionLabels,
    getChainId(chain),
    { args: [networkConfig.contracts.balancer.relayerV6, true] },
    { enabled: !isLoading }
  )

  const step = useUpdateCurrentFlowStep({
    ...minterApprovalTransaction,
    transactionLabels,
    id: 'minterApproval',
    stepType: 'minterApproval',
    isComplete: () => isConnected && hasMinterApproval,
  })

  useEffect(() => {
    if (minterApprovalTransaction.result.isSuccess) refetch()
  }, [minterApprovalTransaction.result.isSuccess])

  return step
}
