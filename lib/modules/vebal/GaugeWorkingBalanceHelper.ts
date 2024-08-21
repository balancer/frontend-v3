import { useReadContract } from 'wagmi'
import { GaugeWorkingBalanceHelperAbi } from '../web3/contracts/abi/gaugeWorkingBalanceHelper'
import { Address } from '@balancer/sdk'

export function useGaugeWorkingBalanceHelper(
  chainId: number,
  contractAddress: Address,
  gauge: string,
  userAddress: string
) {
  const txQuery = useReadContract({
    chainId: chainId,
    address: contractAddress,
    abi: GaugeWorkingBalanceHelperAbi,
    functionName: 'getWorkingBalanceToSupplyRatios',
    args: [gauge, userAddress],
    query: {
      enabled: true,
    },
  })

  return txQuery
}
