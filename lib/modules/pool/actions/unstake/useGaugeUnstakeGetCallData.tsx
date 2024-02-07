import { useQuery } from 'wagmi'
import { usePool } from '../../usePool'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'

export function useGaugeUnstakeGetCallData(amount: bigint, gaugeService: any) {
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

  return useQuery(
    ['unstakeGetContractCallData', inputData],
    () => {
      const contractCallData =
        gaugeService.getGaugeClaimRewardsAndWithdrawContractCallData(inputData)
      return contractCallData
    },
    { enabled: amount.toString() !== '0' }
  )
}
