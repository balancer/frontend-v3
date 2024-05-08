/* eslint-disable react-hooks/exhaustive-deps */
import { TransactionStepButton } from '@/lib/modules/transactions/transaction-steps/TransactionStepButton'
import {
  CommonStepProps,
  OnStepCompleted,
  StepConfig,
} from '../transactions/transaction-steps/useIterateSteps'
import { useConstructApproveRelayerStep } from './useConstructApproveRelayerStep'
import { SupportedChainId } from '@/lib/config/config.types'
import { TransactionLabels, TransactionStep2 } from '../transactions/transaction-steps/lib'
import { ManagedTransactionButton } from '../transactions/transaction-steps/TransactionButton'
import { ManagedTransactionInput } from '../web3/contracts/useManagedTransaction'
import { useUserAccount } from '../web3/useUserAccount'
import { getNetworkConfig } from '@/lib/config/app.config'
import { useHasApprovedRelayer } from './useHasApprovedRelayer'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'
import { useMemo } from 'react'

export const getApproveRelayerConfig = (chainId: SupportedChainId): StepConfig => ({
  title: 'Approve relayer',
  render(useOnStepCompleted: OnStepCompleted) {
    return <ApproveRelayerButton useOnStepCompleted={useOnStepCompleted} chainId={chainId} />
  },
})

export function useApproveRelayerStep(chainId: SupportedChainId): TransactionStep2 {
  const { userAddress, isConnected } = useUserAccount()
  const config = getNetworkConfig(chainId)

  const relayerAddress = config.contracts.balancer.relayerV6
  const vaultAddress = config.contracts.balancer.vaultV2

  const { hasApprovedRelayer, isLoading, refetch } = useHasApprovedRelayer(chainId)

  const labels: TransactionLabels = {
    title: 'Approve relayer',
    init: 'Approve relayer',
    confirming: 'Confirm relayer approval in wallet',
    tooltip: 'TODO',
    description: `🎉 Relayer Approved`,
  }

  const errorMeta = sentryMetaForWagmiSimulation(
    'Error in wagmi tx simulation: Approving Relayer',
    {
      vaultAddress,
      userAddress,
      relayerAddress,
      chainId,
    }
  )

  const props: ManagedTransactionInput = {
    contractAddress: vaultAddress,
    contractId: 'balancer.vaultV2',
    functionName: 'setRelayerApproval',
    labels,
    chainId,
    args: [userAddress, relayerAddress, true],
    additionalConfig: {
      query: {
        enabled: !!userAddress && !isLoading,
        meta: errorMeta,
      },
    },
  }

  const id = 'approve-relayer'

  return useMemo(
    () => ({
      id,
      stepType: 'approveBatchRelayer',
      labels,
      isComplete: () => isConnected && hasApprovedRelayer,
      renderAction: () => <ManagedTransactionButton id={id} {...props} />,
      onSuccess: () => refetch(),
    }),
    [hasApprovedRelayer, isConnected]
  )
}

function ApproveRelayerButton({
  useOnStepCompleted,
  chainId,
}: CommonStepProps & { chainId: SupportedChainId }) {
  const step = useConstructApproveRelayerStep(chainId)

  useOnStepCompleted(step)

  return <TransactionStepButton step={step} />
}
