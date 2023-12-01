'use client'

import { createContext, PropsWithChildren, useEffect } from 'react'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { makeVar, useReactiveVar } from '@apollo/client'
import { usePool } from '../../usePool'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'

export type UseAddLiquidityResponse = ReturnType<typeof _useAddLiquidity>
export const AddLiquidityContext = createContext<UseAddLiquidityResponse | null>(null)

type AmountIn = {
  [tokenAddress: string]: string
}

export const amountsInVar = makeVar<AmountIn[]>([])

export function _useAddLiquidity() {
  const amountsIn = useReactiveVar(amountsInVar)
  const { pool } = usePool()
  const { getToken } = useTokens()

  function setInitialAmountsIn() {
    const amountsIn = pool.allTokens.map(token => ({
      [token.address]: '',
    }))
    amountsInVar(amountsIn)
  }

  useEffect(() => {
    setInitialAmountsIn()
  }, [])

  function setAmountIn(tokenAddress: string, amount: string) {
    const state = amountsInVar()

    amountsInVar([
      ...state.filter(amountIn => !Object.keys(amountIn).includes(tokenAddress)),
      {
        [tokenAddress]: amount,
      },
    ])
  }

  const tokens = pool.allTokens.map(token => getToken(token.address, pool.chain))
  const validTokens = tokens.filter((token): token is GqlToken => !!token)

  return { amountsIn, tokens, validTokens, setAmountIn }
}

export function AddLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useAddLiquidity()
  return <AddLiquidityContext.Provider value={hook}>{children}</AddLiquidityContext.Provider>
}

export const useAddLiquidity = (): UseAddLiquidityResponse =>
  useMandatoryContext(AddLiquidityContext, 'AddLiquidity')
