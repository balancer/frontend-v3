import { useQuery } from 'wagmi'
import { Address } from 'viem'
import { GaugeService } from '@/lib/shared/services/staking/gauge.service'
import { BatchRelayerService } from '@/lib/shared/services/batch-relayer/batch-relayer.service'
import { gaugeActionsService } from '@/lib/shared/services/batch-relayer/extensions/gauge-actions.service'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'

export function useClaimCallDataQuery(gaugesAddresses: Address[]) {
  const networkConfig = useNetworkConfig()

  const inputData = {
    hasPendingNonBALRewards: true, // TODO: replace with actual bool
    hasPendingBalRewards: true, // TODO: replace with actual bool
    gauges: gaugesAddresses,
    outputReference: 0n,
  }

  const queryKey = ['claim', 'gauge', 'callData', inputData]
  const queryFn = () => {
    const batchRelayerService = new BatchRelayerService(
      networkConfig.contracts.balancer.relayerV6,
      gaugeActionsService
    )
    const gaugeService = new GaugeService(batchRelayerService)
    return gaugeService.getGaugeClaimRewardsContractCallData(inputData) as Address[]
  }

  const queryOpts = { enabled: gaugesAddresses.length > 0 }
  return useQuery(queryKey, queryFn, queryOpts)
}
