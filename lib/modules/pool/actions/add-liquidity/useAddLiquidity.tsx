/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTokens } from '@/lib/modules/tokens/useTokens'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { priceImpactFormat, safeSum } from '@/lib/shared/utils/numbers'
import { makeVar, useReactiveVar } from '@apollo/client'
import { HumanAmount, TokenAmount } from '@balancer/sdk'
import { PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Address } from 'viem'
import { usePool } from '../../usePool'
import { AddLiquidityService } from './AddLiquidityService'
import { HumanAmountIn } from './add-liquidity.types'

export type UseAddLiquidityResponse = ReturnType<typeof _useAddLiquidity>
export const AddLiquidityContext = createContext<UseAddLiquidityResponse | null>(null)

export const amountsInVar = makeVar<HumanAmountIn[]>([])

export function _useAddLiquidity() {
  const amountsIn = useReactiveVar(amountsInVar)
  const [priceImpact, setPriceImpact] = useState<number | null>(null)
  const [bptOut, setBptOut] = useState<TokenAmount | null>(null)

  const { pool, poolStateInput, chainId } = usePool()
  const { getToken, usdValueForToken } = useTokens()

  const addLiquidityService = new AddLiquidityService(chainId, poolStateInput, 'unbalanced')

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
  const formattedPriceImpact = priceImpact ? priceImpactFormat(priceImpact) : '-'

  async function queryPriceImpact() {
    const _priceImpact = await addLiquidityService.calculatePriceImpact({
      humanAmountsIn: amountsIn,
    })

    setPriceImpact(_priceImpact)
  }

  async function queryExpectedOutput() {
    const { bptOut } = await addLiquidityService.queryAddLiquidity({ humanAmountsIn: amountsIn })

    setBptOut(bptOut)
  }

  // Debounced queries
  const debouncedQueryPriceImpact = useDebouncedCallback(queryPriceImpact, 300)
  const debouncedQueryBptOut = useDebouncedCallback(queryExpectedOutput, 300)

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
    bptOut,
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
