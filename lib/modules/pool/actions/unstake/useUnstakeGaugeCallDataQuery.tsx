import { useQuery } from 'wagmi'
import { usePool } from '../../usePool'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'

// TODO: typing 'gaugeService' cascades a lot
export function useUnstakeGaugeCallDataQuery(amount: bigint, gaugeService: any) {
  const { userAddress } = useUserAccount()
  const { pool } = usePool()

  const inputData = {
    hasPendingNonBALRewards: true, // TODO: replace with actual bool
    hasPendingBalRewards: true, // TODO: replace with actual bool
    gauges: [pool.staking?.id || ''],
    sender: userAddress || '',
    recipient: userAddress || '',
    amount,
    outputReference: 0n,
  }

  const queryKey = ['unstake', , 'gauge', 'callData', inputData]
  const queryFn = () => gaugeService.getGaugeClaimRewardsAndWithdrawContractCallData(inputData)
  const queryOpts = { enabled: amount.toString() !== '0' }

  return useQuery(queryKey, queryFn, queryOpts)
}
