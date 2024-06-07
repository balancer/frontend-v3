import { GaugeService } from '@/lib/shared/services/staking/gauge.service'
import { Address, Hex } from 'viem'

type Params = {
  amount: bigint
  gaugeService: GaugeService | undefined
  gauges: Address[]
  hasPendingNonBalRewards: boolean
  hasPendingBalRewards: boolean
  userAddress: Address
}
export function useBuildUnstakeCallData({
  amount,
  gaugeService,
  gauges,
  hasPendingNonBalRewards,
  hasPendingBalRewards,
  userAddress,
}: Params): Hex[] {
  if (!amount) return []
  if (!gaugeService) return []
  if (!userAddress) return []

  const inputData = {
    hasPendingNonBalRewards,
    hasPendingBalRewards,
    gauges,
    sender: userAddress || '',
    recipient: userAddress || '',
    amount,
    outputReference: 0n,
  }

  return gaugeService.getGaugeClaimRewardsAndWithdrawContractCallData(inputData)
}
