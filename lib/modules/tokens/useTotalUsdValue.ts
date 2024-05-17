import { useTokens } from '@/lib/modules/tokens/useTokens'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { safeSum } from '@/lib/shared/utils/numbers'
import { useCallback } from 'react'
import { HumanAmountIn } from '../liquidity-types'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'

export function useTotalUsdValue(tokens: GqlToken[]) {
  const { usdValueForToken } = useTokens()
  const calculateUsdAmountsIn = useCallback(
    (humanAmountsIn: HumanAmountIn[]) =>
      humanAmountsIn.map(amountIn => {
        const token = tokens.find(token => isSameAddress(token?.address, amountIn.tokenAddress))

        if (!token) return '0'

        return usdValueForToken(token, amountIn.humanAmount)
      }),
    [usdValueForToken, tokens]
  )

  function usdValueFor(humanAmountsIn: HumanAmountIn[]) {
    return safeSum(calculateUsdAmountsIn(humanAmountsIn))
  }

  return { usdValueFor }
}
