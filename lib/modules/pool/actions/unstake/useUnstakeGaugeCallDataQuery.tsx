import { useQuery } from 'wagmi'
import { usePool } from '../../usePool'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { GaugeService } from '@/lib/shared/services/staking/gauge.service'
import { Address } from 'viem'

export function useUnstakeGaugeCallDataQuery(
  amount: bigint,
  gaugeService: GaugeService | undefined,
  hasPendingNonBalRewards: boolean,
  hasPendingBalRewards: boolean
) {
  const { userAddress } = useUserAccount()
  const { pool } = usePool()

  const inputData = {
    hasPendingNonBalRewards,
    hasPendingBalRewards,
    gauges: [(pool.staking?.id || '') as Address],
    sender: userAddress || '',
    recipient: userAddress || '',
    amount,
    outputReference: 0n,
  }

  const queryKey = ['unstake', 'gauge', 'callData', inputData]
  const queryFn = () =>
    gaugeService && gaugeService.getGaugeClaimRewardsAndWithdrawContractCallData(inputData)
  const queryOpts = { enabled: gaugeService && amount.toString() !== '0' }

  const query = useQuery(queryKey, queryFn, queryOpts)

  return {
    ...query,
    data: query.data || [],
  }
}
