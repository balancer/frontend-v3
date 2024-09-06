import { ManagedTransactionButton } from '@/lib/modules/transactions/transaction-steps/TransactionButton'
import { useTransactionState } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'
import {
  TransactionLabels,
  TransactionStep,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { ManagedTransactionInput } from '@/lib/modules/web3/contracts/useManagedTransaction'
import { useUserAccount } from '@/lib/modules/web3/UserAccountProvider'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'
import { useMemo } from 'react'
import { Address } from 'viem'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { useEstimateSendUserBalance } from '@/lib/modules/vebal/cross-chain/useEstimateSendUserBalance'
import { Button } from '@chakra-ui/react'
import { getChainShortName, getNetworkConfig } from '@/lib/config/app.config'
import { CrossChainSyncModalContent } from '@/lib/modules/vebal/cross-chain/CrossChainSyncModalContent'

export const crossChainSyncStepPrefix = 'cross-chain-sync'

export interface CrossChainSyncStepsProps {
  networks: GqlChain[]
}

function ChainSyncButton({
  tokenAddress,
  layerZeroChainId,
  stepId,
  network,
}: {
  tokenAddress: Address
  layerZeroChainId: number
  stepId: string
  network: GqlChain
}) {
  const { chainId } = useNetworkConfig()
  const { data, error, isLoading } = useEstimateSendUserBalance(tokenAddress, layerZeroChainId)
  const { userAddress } = useUserAccount()

  // FIXME - handle error
  if (error) {
    return <Button disabled>Failed: {error.message}</Button>
  }

  if (!data) {
    return <Button isLoading={isLoading}>Loading</Button>
  }

  const nativeFee = BigInt(data.nativeFee.toString())

  const txSimulationMeta = sentryMetaForWagmiSimulation(
    'Error in wagmi tx simulation (Cross Chain Sync transaction)',
    {
      userAddress,
      layerZeroChainId,
      stepId,
      chainId,
    }
  )

  // FIX: actual labels
  const labels: TransactionLabels = {
    tooltip: `Sync veBAL to ${getChainShortName(network)}`,
    init: `Sync veBAL to ${getChainShortName(network)}`,
    title: `Sync veBAL to ${getChainShortName(network)}`,
    description: `Sync veBAL to ${getChainShortName(network)}`,
    confirming: `Syncing veBAL to ${getChainShortName(network)}`,
    confirmed: `Synced to ${getChainShortName(network)}`,
  }

  const props: ManagedTransactionInput = {
    contractId: 'balancer.omniVotingEscrowAbi',
    chainId,
    functionName: 'sendUserBalance',
    contractAddress: tokenAddress,
    enabled: Boolean(nativeFee),
    txSimulationMeta,
    args: [userAddress, layerZeroChainId, userAddress],
    labels,
    txConfig: { value: nativeFee },
  }

  return <ManagedTransactionButton id={stepId} {...props} />
}

export function useCrossChainSyncSteps({ networks }: CrossChainSyncStepsProps): TransactionStep[] {
  const { userAddress } = useUserAccount()
  const { getTransaction } = useTransactionState()

  const { contracts } = getNetworkConfig(GqlChain.Mainnet)

  return useMemo(
    () =>
      networks
        .filter(network => {
          const networkConfig = getNetworkConfig(network)
          return Boolean(networkConfig.layerZeroChainId)
        })
        .map(network => {
          const stepId = `${crossChainSyncStepPrefix}-${network}`

          const transaction = getTransaction(stepId)

          const isComplete = () => userAddress && !!transaction?.result.isSuccess

          const networkConfig = getNetworkConfig(network)

          // FIX: actual labels
          const labels: TransactionLabels = {
            init: 'Sync',
            title: `Sync veBAL to ${getChainShortName(network)}`,
            description: 'description - Cross Chain Sync.',
            confirming: 'confirming - Cross Chain Sync...',
            confirmed: 'confirmed - Cross Chain Sync!',
            tooltip: 'tooltip - Cross Chain Sync',
          }

          return {
            id: stepId,
            stepType: 'crossChainSync',
            labels,
            isComplete,
            renderAction: () => (
              <ChainSyncButton
                key={stepId}
                network={network}
                stepId={stepId}
                layerZeroChainId={networkConfig.layerZeroChainId!}
                tokenAddress={contracts.omniVotingEscrow!}
              />
            ),
            renderContent: () => (
              <CrossChainSyncModalContent
                key={stepId}
                currentNetwork={network}
                networks={networks}
              />
            ),
          }
        }),
    [networks, getTransaction, userAddress, contracts.omniVotingEscrow]
  )
}
