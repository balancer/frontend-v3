/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTokens } from '@/lib/modules/tokens/useTokens'
import { priceImpactFormat, safeSum } from '@/lib/shared/hooks/useNumbers'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { makeVar, useReactiveVar } from '@apollo/client'
import { AddLiquidityQueryOutput, HumanAmount } from '@balancer/sdk'
import { PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Address } from 'viem'
import { usePool } from '../../usePool'
import { HumanAmountIn } from './add-liquidity.types'
import { PriceImpactAmount, calculatePriceImpact } from './calculatePriceImpact'
import { AddLiquidityConfigBuilder } from './AddLiquidityConfigBuilder'
import { queryAddLiquidity } from './queryAddLiquidity'

export type UseAddLiquidityResponse = ReturnType<typeof _useAddLiquidity>
export const AddLiquidityContext = createContext<UseAddLiquidityResponse | null>(null)

export const amountsInVar = makeVar<HumanAmountIn[]>([])

export function _useAddLiquidity() {
  const amountsIn = useReactiveVar(amountsInVar)
  const { pool, poolStateInput, chainId } = usePool()
  const { getToken, usdValueForToken } = useTokens()

  function setInitialAmountsIn() {
    const amountsIn = pool.allTokens.map(
      token =>
        ({
          tokenAddress: token.address,
          humanAmount: '',
        } as HumanAmountIn)
    )
    amountsInVar(amountsIn)
  }

  useEffect(() => {
    setInitialAmountsIn()
  }, [])

  function setAmountIn(tokenAddress: Address, humanAmount: HumanAmount) {
    const state = amountsInVar()

    amountsInVar([
      ...state.filter(amountIn => !isSameAddress(amountIn.tokenAddress, tokenAddress)),
      {
        tokenAddress,
        humanAmount,
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

        return usdValueForToken(token, amountIn.humanAmount)
      }),
    [amountsIn, usdValueForToken, validTokens]
  )

  const totalUSDValue = safeSum(usdAmountsIn)

  const [priceImpact, setPriceImpact] = useState<PriceImpactAmount | null>(null)

  const addLiquidityConfigBuilder = new AddLiquidityConfigBuilder(
    chainId,
    poolStateInput,
    'unbalanced'
  )

  async function queryPriceImpact() {
    const priceImpactAmount = await calculatePriceImpact(addLiquidityConfigBuilder, amountsIn)

    setPriceImpact(priceImpactAmount)
  }
  const debouncedQueryPriceImpact = useDebouncedCallback(queryPriceImpact, 300)

  const formattedPriceImpact = priceImpact ? priceImpactFormat(priceImpact.decimal) : '-'

  const [addLiquidityQuery, setAddLiquidityQuery] = useState<AddLiquidityQueryOutput | null>(null)
  async function queryBptOut() {
    const queryResult = await queryAddLiquidity(addLiquidityConfigBuilder, amountsIn)

    setAddLiquidityQuery(queryResult)
  }
  const debouncedQueryBptOut = useDebouncedCallback(queryBptOut, 300)

  // When the amounts in change we fetch the new price impact
  useEffect(() => {
    debouncedQueryPriceImpact()
    debouncedQueryBptOut()
  }, [amountsIn])

  // TODO: Call underlying SDK execution function
  function executeAddLiquidity() {
    console.log('amountsIn', amountsIn)
  }

  return {
    amountsIn,
    tokens,
    validTokens,
    totalUSDValue,
    priceImpact,
    formattedPriceImpact,
    addLiquidityQuery,
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
