import { auraBaseRewardPool4626Abi } from '@/lib/modules/web3/contracts/abi/generated'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'

export function useGetAuraPid(chainId: number, poolAddress: Address) {
  const query = useReadContract({
    chainId,
    abi: auraBaseRewardPool4626Abi,
    address: poolAddress,
    functionName: 'pid',
    query: { enabled: !!poolAddress },
  })

  return query
}
