import { useQuery } from 'wagmi'
import { Address } from 'viem'
import { GaugeService } from '@/lib/shared/services/staking/gauge.service'

export function useClaimCallDataQuery(
  gaugeAddresses: Address[],
  gaugeService: GaugeService | undefined,
  hasPendingNonBALRewards: boolean,
  hasPendingBalRewards: boolean
) {
  const inputData = {
    hasPendingNonBALRewards,
    hasPendingBalRewards,
    gauges: gaugeAddresses,
    outputReference: 0n,
  }

  const queryKey = ['claim', 'gauge', 'callData', inputData]
  const queryFn = () => gaugeService && gaugeService.getGaugeClaimRewardsContractCallData(inputData)
  const queryOpts = { enabled: gaugeService && gaugeAddresses.length > 0 }

  const query = useQuery(queryKey, queryFn, queryOpts)

  return {
    ...query,
    data: query.data || [],
  }
}
