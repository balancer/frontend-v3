/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { createContext, PropsWithChildren, useEffect, useMemo } from 'react'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { makeVar, useReactiveVar } from '@apollo/client'
import { usePool } from '../../usePool'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { safeSum } from '@/lib/shared/utils/numbers'

export type UseAddLiquidityResponse = ReturnType<typeof _useAddLiquidity>
export const AddLiquidityContext = createContext<UseAddLiquidityResponse | null>(null)

export type AmountIn = {
  tokenAddress: string
  value: string
}

export const amountsInVar = makeVar<AmountIn[]>([])

export function _useAddLiquidity() {
  const amountsIn = useReactiveVar(amountsInVar)
  const { pool } = usePool()
  const { getToken, usdValueForToken } = useTokens()

  function setInitialAmountsIn() {
    const amountsIn = pool.allTokens.map(token => ({
      tokenAddress: token.address,
      value: '',
    }))
    amountsInVar(amountsIn)
  }

  useEffect(() => {
    setInitialAmountsIn()
  }, [])

  function setAmountIn(tokenAddress: string, value: string) {
    const state = amountsInVar()

    amountsInVar([
      ...state.filter(amountIn => !isSameAddress(amountIn.tokenAddress, tokenAddress)),
      {
        tokenAddress,
        value,
      },
    ])
  }

  const tokens = pool.allTokens.map(token => getToken(token.address, pool.chain))
  const validTokens = tokens.filter((token): token is GqlToken => !!token)

  const usdAmountsIn = useMemo(
    () =>
      amountsIn.map(amountIn => {
        const token = validTokens.find(token =>
          isSameAddress(token?.address, amountIn.tokenAddress)
        )

        if (!token) return '0'
        console.log('amountIn', amountIn)

        return usdValueForToken(token, amountIn.value)
      }),
    [amountsIn, usdValueForToken, validTokens]
  )

  const totalUSDValue = safeSum(usdAmountsIn)

  // When the amounts in change we should fetch the expected output.
  useEffect(() => {
    queryAddLiquidity()
  }, [amountsIn])

  // TODO: Call underlying SDK query function
  function queryAddLiquidity() {
    console.log('amountsIn', amountsIn)
  }

  // TODO: Call underlying SDK execution function
  function executeAddLiquidity() {
    console.log('amountsIn', amountsIn)
  }

  return {
    amountsIn,
    tokens,
    validTokens,
    totalUSDValue,
    setAmountIn,
    executeAddLiquidity,
  }
}

export function AddLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useAddLiquidity()
  return <AddLiquidityContext.Provider value={hook}>{children}</AddLiquidityContext.Provider>
}

export const useAddLiquidity = (): UseAddLiquidityResponse =>
  useMandatoryContext(AddLiquidityContext, 'AddLiquidity')
