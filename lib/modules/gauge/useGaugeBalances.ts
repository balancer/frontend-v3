import { Address, useContractReads } from 'wagmi'
import { Pool } from '../pool/usePool'
import { useUserAccount } from '../web3/useUserAccount'
import { ContractFunctionConfig } from 'viem'
import { AbiMap } from '../web3/contracts/AbiMap'
import { zeroAddress } from 'viem'
import { ChainContractConfig, useMulticall } from '../web3/contracts/useMulticall'
import { flatten } from 'lodash'

export function useGaugeBalances(pools: Pool[]) {
  const { userAddress, isConnected } = useUserAccount()

  const v1_requests = pools.filter(pool => pool.staking?.gauge?.version === 1)
  const v2_requests: ChainContractConfig[][] =
    pools
      .filter(pool => pool.staking?.gauge?.version === 2)
      .map(pool => {
        // need to make a call for each reward token
        const rewardTokenCalls: ChainContractConfig[] = (pool.staking?.gauge?.rewards || []).map(
          rewardToken => {
            return {
              id: `claimableGaugeReward.${pool.staking?.gauge?.gaugeAddress}.${rewardToken.tokenAddress}`,
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

  const flattenedRequests = flatten(v2_requests)
  const data = useMulticall(flattenedRequests)
  console.log('d', data)

  // const {
  //   data: stakedPoolBalances = [],
  //   isLoading: isLoadingStakedPoolBalances,
  //   refetch: refetchedStakedBalances,
  //   error: stakedPoolBalancesError,
  // } = useContractReads({
  //   enabled: isConnected,
  //   contracts: pools.map(
  //     pool =>
  //       ({
  //         abi: balancerV2GaugeV5ABI,
  //         // We have to let the contract call fail if there is no gauge address so the array is the right size.
  //         address: (pool.staking?.gauge?.gaugeAddress as Address) || zeroAddress,
  //         functionName: 'balanceOf',
  //         args: [userAddress],
  //         chainId: chainToIdMap[pool.chain],
  //       } as const)
  //   ),
  // })
  return {}
}
