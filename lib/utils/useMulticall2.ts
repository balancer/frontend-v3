import { useContractRead } from 'wagmi'
import { Address, decodeFunctionResult, encodeFunctionData, Hex } from 'viem'
import Multicall2Abi from '@/lib/abi/Multicall2.json'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'

interface UseMultiCallInput {
  abi: any[]
  calls: { address: Address; functionName: string; args: any[] }[]
  options?: any
  requireSuccess?: boolean
  enabled?: boolean
  cacheTime?: number
}

export function useMulticall2<T>({
  abi,
  calls,
  requireSuccess = false,
  enabled = true,
  cacheTime,
}: UseMultiCallInput) {
  const networkConfig = useNetworkConfig()
  const { data, ...rest } = useContractRead({
    address: networkConfig.multicall2,
    abi: Multicall2Abi,
    functionName: 'tryAggregate',
    args: [
      requireSuccess,
      calls.map(call => [
        call.address,
        encodeFunctionData({
          abi,
          functionName: call.functionName,
          args: call.args,
        }),
      ]),
    ],
    enabled,
    cacheTime,
  })

  const typedData = data as { success: boolean; returnData: Hex }[] | undefined
  const mappedData = (typedData || []).map(({ success, returnData }, i) => {
    if (!success) {
      return null
    }

    return decodeFunctionResult({
      abi,
      functionName: calls[i].functionName,
      args: calls[i].args,
      data: returnData,
    })
  }) as (T | null)[]

  return { ...rest, data: mappedData }
}
