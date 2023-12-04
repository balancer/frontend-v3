'use client'

import { createContext, PropsWithChildren, useEffect, useMemo } from 'react'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { makeVar, useReactiveVar } from '@apollo/client'
import { usePool } from '../../usePool'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { safeSum } from '@/lib/shared/hooks/useNumbers'
import { isSameAddress } from '@/lib/shared/utils/addresses'

export type UseRemoveLiquidityResponse = ReturnType<typeof _useRemoveLiquidity>
export const RemoveLiquidityContext = createContext<UseRemoveLiquidityResponse | null>(null)

export type AmountOut = {
  tokenAddress: string
  value: string
}

export const amountsOutVar = makeVar<AmountOut[]>([])

export function _useRemoveLiquidity() {
  const amountsOut = useReactiveVar(amountsOutVar)
  const { pool } = usePool()
  const { getToken, usdValueForToken } = useTokens()

  function setInitialAmountsOut() {
    const amountsOut = pool.allTokens.map(token => ({
      tokenAddress: token.address,
      value: '',
    }))
    amountsOutVar(amountsOut)
  }

  useEffect(() => {
    setInitialAmountsOut()
  }, [])

  function setAmountOut(tokenAddress: string, value: string) {
    const state = amountsOutVar()

    amountsOutVar([
      ...state.filter(amountOut => !isSameAddress(amountOut.tokenAddress, tokenAddress)),
      {
        tokenAddress,
        value,
      },
    ])
  }

  const tokens = pool.allTokens.map(token => getToken(token.address, pool.chain))
  const validTokens = tokens.filter((token): token is GqlToken => !!token)

  const usdAmountsOut = useMemo(
    () =>
      amountsOut.map(amountOut => {
        const token = validTokens.find(token =>
          isSameAddress(token?.address, amountOut.tokenAddress)
        )

        if (!token) return '0'
        console.log('amountOut', amountOut)

        return usdValueForToken(token, amountOut.value)
      }),
    [amountsOut, usdValueForToken, validTokens]
  )

  const totalUSDValue = safeSum(usdAmountsOut)

  // When the amounts in change we should fetch the expected output.
  useEffect(() => {
    queryRemoveLiquidity()
  }, [amountsOut])

  // TODO: Call underlying SDK query function
  function queryRemoveLiquidity() {
    console.log('amountsOut', amountsOut)
  }

  // TODO: Call underlying SDK execution function
  function executeRemoveLiquidity() {
    console.log('amountsOut', amountsOut)
  }

  return {
    amountsOut,
    tokens,
    validTokens,
    totalUSDValue,
    setAmountOut,
    executeRemoveLiquidity,
  }
}

export function RemoveLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useRemoveLiquidity()
  return <RemoveLiquidityContext.Provider value={hook}>{children}</RemoveLiquidityContext.Provider>
}

export const useRemoveLiquidity = (): UseRemoveLiquidityResponse =>
  useMandatoryContext(RemoveLiquidityContext, 'RemoveLiquidity')
