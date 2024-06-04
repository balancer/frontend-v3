import { GaugeService } from '@/lib/shared/services/staking/gauge.service'
import { Address, Hex } from 'viem'
import { usePool } from '../../PoolProvider'

type Params = {
  amount: bigint
  gaugeService: GaugeService | undefined
  hasPendingNonBalRewards: boolean
  hasPendingBalRewards: boolean
  userAddress: Address
}
export function useBuildUnstakeCallData({
  amount,
  gaugeService,
  hasPendingNonBalRewards,
  hasPendingBalRewards,
  userAddress,
}: Params): Hex[] {
  const { pool } = usePool()

  if (!amount) return []
  if (!gaugeService) return []
  if (!userAddress) return []

  const inputData = {
    hasPendingNonBalRewards,
    hasPendingBalRewards,
    gauges: [(pool.staking?.id || '') as Address],
    sender: userAddress || '',
    recipient: userAddress || '',
    amount,
    outputReference: 0n,
  }

  return gaugeService.getGaugeClaimRewardsAndWithdrawContractCallData(inputData)
}
