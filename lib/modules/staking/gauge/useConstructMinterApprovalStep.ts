/* eslint-disable react-hooks/exhaustive-deps */
import { FlowStep, TransactionLabels } from '@/lib/shared/components/btns/transaction-steps/lib'
import { useManagedTransaction } from '@/lib/modules/web3/contracts/useManagedTransaction'
import { getNetworkConfig } from '@/lib/config/app.config'
import { useHasMinterApproval } from './useHasMinterApproval'
import { useEffect } from 'react'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

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
    { args: [networkConfig.contracts.balancer.relayerV6, true] },
    { enabled: !isLoading }
  )

  const step: FlowStep = {
    ...minterApprovalTransaction,
    transactionLabels,
    id: 'minterApproval',
    stepType: 'minterApproval',
    isComplete: () => isConnected && hasMinterApproval,
  }

  useEffect(() => {
    if (minterApprovalTransaction.result.isSuccess) refetch()
  }, [minterApprovalTransaction.result.isSuccess])

  return step
}
