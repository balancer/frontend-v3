/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTokens } from '@/lib/modules/tokens/useTokens'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { fNum, safeSum } from '@/lib/shared/utils/numbers'
import { makeVar, useReactiveVar } from '@apollo/client'
import { AddLiquidityQueryOutput, HumanAmount } from '@balancer/sdk'
import { PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Address, formatUnits } from 'viem'
import { usePool } from '../../usePool'
import { AddLiquidityConfigBuilder } from './AddLiquidityConfigBuilder'
import { HumanAmountIn } from './add-liquidity.types'
import { PriceImpactAmount, calculatePriceImpact } from './calculatePriceImpact'
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

  const formattedPriceImpact = priceImpact ? fNum(priceImpact.decimal, 'priceImpact') : '-'

  const [addLiquidityQuery, setAddLiquidityQuery] = useState<AddLiquidityQueryOutput | null>(null) //TODO: rename to queryBptOut if that's the only thing we need from the query result
  async function queryBptOut() {
    const queryResult = await queryAddLiquidity(addLiquidityConfigBuilder, amountsIn)

    setAddLiquidityQuery(queryResult)
  }
  const debouncedQueryBptOut = useDebouncedCallback(queryBptOut, 300)

  const bptOutUnits: HumanAmount = addLiquidityQuery?.bptOut
    ? (formatUnits(addLiquidityQuery?.bptOut.amount, 18) as HumanAmount)
    : '0'

  // When the amounts in change we fetch the new price impact
  useEffect(() => {
    debouncedQueryPriceImpact()
    debouncedQueryBptOut()
  }, [amountsIn])

  return {
    amountsIn,
    tokens,
    validTokens,
    totalUSDValue,
    priceImpact,
    formattedPriceImpact,
    addLiquidityQuery,
    bptOutUnits,
    setAmountIn,
    builder: addLiquidityConfigBuilder,
  }
}

export function AddLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useAddLiquidity()
  return <AddLiquidityContext.Provider value={hook}>{children}</AddLiquidityContext.Provider>
}

export const useAddLiquidity = (): UseAddLiquidityResponse =>
  useMandatoryContext(AddLiquidityContext, 'AddLiquidity')
