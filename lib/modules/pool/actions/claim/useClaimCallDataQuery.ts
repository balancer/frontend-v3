import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'
import { GaugeService } from '@/lib/shared/services/staking/gauge.service'

export function useClaimCallDataQuery(
  gaugeAddresses: Address[],
  gaugeService: GaugeService | undefined,
  hasPendingNonBalRewards: boolean,
  hasPendingBalRewards: boolean
) {
  const inputData = {
    hasPendingNonBalRewards,
    hasPendingBalRewards,
    gauges: gaugeAddresses,
    outputReference: 0n,
  }

  const queryKey = ['claim', 'gauge', 'callData', inputData]
  const queryFn = () => gaugeService && gaugeService.getGaugeClaimRewardsContractCallData(inputData)

  const query = useQuery({
    queryKey,
    queryFn,
    enabled: gaugeService && gaugeAddresses.length > 0,
  })

  return {
    ...query,
    data: query.data || [],
  }
}
