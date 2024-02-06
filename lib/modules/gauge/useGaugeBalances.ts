import { Address, useContractReads } from 'wagmi'
import { Pool } from '../pool/usePool'
import { useUserAccount } from '../web3/useUserAccount'
import { ContractFunctionConfig } from 'viem'
import { AbiMap } from '../web3/contracts/AbiMap'
import { zeroAddress } from 'viem'
import { ChainContractConfig, useMulticall } from '../web3/contracts/useMulticall'
import { flatten, mapValues } from 'lodash'

function useGaugeV2ClaimableRewards(pools: Pool[]) {
  const { userAddress, isConnected } = useUserAccount()
  const multicallRequests: ChainContractConfig[][] =
    pools
      .filter(pool => pool.staking?.gauge?.version === 2)
      .map(pool => {
        // need to make a call for each reward token
        const rewardTokenCalls: ChainContractConfig[] = (pool.staking?.gauge?.rewards || []).map(
          rewardToken => {
            return {
              id: `${pool.address}.${rewardToken.tokenAddress}`,
              address: (pool.staking?.gauge?.gaugeAddress || zeroAddress) as Address,
              args: [userAddress, rewardToken.tokenAddress],
              functionName: 'claimable_reward',
              abi: AbiMap['balancer.gaugeV5'],
              chain: pool.chain,
            }
          }
        )

        return rewardTokenCalls
      }) || []

  return useMulticall(flatten(multicallRequests))
}

export function useGaugeBalances(pools: Pool[]) {
  const v1_requests = pools.filter(pool => pool.staking?.gauge?.version === 1)
  const v2ClaimableRewardsPerChain = useGaugeV2ClaimableRewards(
    pools.filter(pool => pool.staking?.gauge?.version === 2)
  )

  // Assign call to flatten list into a single object keyed by the pool address
  const v2ClaimableRewardsPerPool = Object.assign(
    {},
    ...flatten(Object.values(v2ClaimableRewardsPerChain).map(rewards => rewards.data)).filter(
      p => p
    )
  )

  const rewards = v2ClaimableRewardsPerPool
  return { rewards }
}
