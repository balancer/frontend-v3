import { useQuery } from 'wagmi'
import { Address, decodeFunctionResult, encodeFunctionData, Hex } from 'viem'
import Multicall2Abi from '@/lib/abi/Multicall2.json'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { readContract } from 'wagmi/actions'

interface UseMultiCallInput {
  abi: any[]
  calls: { address: Address; functionName: string; args: any[] }[]
  options?: any
  requireSuccess?: boolean
  enabled?: boolean
  cacheTime?: number
  // If your calls list is large, this can create an issue where the queryKey
  // generated below overflows the useQuery cache. In such instances,
  // provide a custom query key to avoid this
  queryKey?: string
}

export function useMulticall2<T>({
  abi,
  calls,
  requireSuccess = false,
  enabled = true,
  cacheTime,
  queryKey,
}: UseMultiCallInput) {
  const networkConfig = useNetworkConfig()

  const { data, ...rest } = useQuery(
    queryKey
      ? [queryKey]
      : [
          'useMultiCall',
          requireSuccess,
          JSON.stringify(abi),
          JSON.stringify(calls),
        ],
    async () => {
      const data = await readContract({
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
      })

      console.log('data', data)

      return data
    },
    {
      enabled,
      cacheTime,
    }
  )

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
