import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { useQuery } from 'wagmi'
import { useSwap } from '../useSwap'
import { swapQueryKeys } from './swapQueryKeys'
import { SimulateSwapResponse } from '../swap.types'
import { ensureLastQueryResponse } from '../../pool/actions/LiquidityActionHelpers'

export type BuildSwapQueryResponse = ReturnType<typeof useBuildSwapQuery>

// Uses the SDK to build a transaction config to be used by wagmi's useManagedSendTransaction
export function useBuildSwapQuery() {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()

  const { handler, simulationQuery, selectedChain, isNativeAssetIn, tokenIn, tokenOut, swapType } =
    useSwap()

  const queryKey = swapQueryKeys.build({
    chain: selectedChain,
    account: userAddress,
    slippagePercent: slippage,
    simulateResponse: simulationQuery.data || ({} as SimulateSwapResponse),
  })

  const queryFn = async () => {
    const simulateResponse = ensureLastQueryResponse('Swap query', simulationQuery.data)

    const response = await handler.build({
      tokenIn,
      tokenOut,
      swapType,
      account: userAddress,
      slippagePercent: slippage,
      chain: selectedChain,
      simulateResponse,
      isNativeAssetIn,
    })
    console.log('Swap callData built:', response)

    return response
  }

  const queryOpts = {
    enabled: isConnected && !!simulationQuery.data,
    cacheTime: 0,
    ...onlyExplicitRefetch,
  }

  return useQuery(queryKey, queryFn, queryOpts)
}
