/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTokens } from '@/lib/modules/tokens/useTokens'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { safeSum } from '@/lib/shared/utils/numbers'
import { makeVar, useReactiveVar } from '@apollo/client'
import { HumanAmount } from '@balancer/sdk'
import { PropsWithChildren, createContext, useEffect, useMemo } from 'react'
import { Address } from 'viem'
import { usePool } from '../../usePool'
import { LiquidityActionHelpers, areEmptyAmounts } from '../LiquidityActionHelpers'
import { HumanAmountIn } from '../liquidity-types'
import { selectRemoveLiquidityHandler } from './handlers/selectRemoveLiquidityHandler'
import { useBuildRemoveLiquidityQuery } from './queries/useBuildRemoveLiquidityTxQuery'
import { useRemoveLiquidityBtpInQuery } from './queries/useRemoveLiquidityBptInQuery'
import { useRemoveLiquidityPriceImpactQuery } from './queries/useRemoveLiquidityPriceImpactQuery'

export type UseRemoveLiquidityResponse = ReturnType<typeof _useRemoveLiquidity>
export const RemoveLiquidityContext = createContext<UseRemoveLiquidityResponse | null>(null)

export const amountsInVar = makeVar<HumanAmountIn[]>([])

export function _useRemoveLiquidity() {
  const amountsIn = useReactiveVar(amountsInVar)

  const { pool, poolStateInput } = usePool()
  const { getToken, usdValueForToken } = useTokens()

  const handler = selectRemoveLiquidityHandler(pool)

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

  const { priceImpact, isPriceImpactLoading } = useRemoveLiquidityPriceImpactQuery(
    handler,
    amountsIn,
    pool.id
  )

  const { bptIn, isBptInQueryLoading, lastSdkQueryOutput } = useRemoveLiquidityBtpInQuery(
    handler,
    amountsIn,
    pool.id
  )

  // TODO: we will need to render reasons why the transaction cannot be performed so instead of a boolean this will become an object
  const isAddLiquidityDisabled = areEmptyAmounts(amountsIn)

  /* We don't expose individual helper methods like getAmountsToApprove or poolTokenAddresses because
    helper is a class and if we return its methods we would lose the this binding, getting a:
    TypeError: Cannot read property getAmountsToApprove of undefined
    when trying to access the returned method
    */
  const helpers = new LiquidityActionHelpers(pool)

  function useBuildTx(humanAmountsIn: HumanAmountIn[], isActiveStep: boolean) {
    return useBuildRemoveLiquidityQuery(
      handler,
      humanAmountsIn,
      isActiveStep,
      pool.id,
      // This is an optional parameter that will be sometimes undefined (when the handler does not use the SDK)
      lastSdkQueryOutput
    )
  }

  return {
    amountsIn,
    tokens,
    validTokens,
    totalUSDValue,
    priceImpact,
    isPriceImpactLoading,
    bptIn,
    isBptInQueryLoading,
    setAmountIn,
    isAddLiquidityDisabled,
    useBuildTx,
    lastSdkQueryOutput,
    helpers,
    poolStateInput,
  }
}

export function RemoveLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useRemoveLiquidity()
  return <RemoveLiquidityContext.Provider value={hook}>{children}</RemoveLiquidityContext.Provider>
}

export const useRemoveLiquidity = (): UseRemoveLiquidityResponse =>
  useMandatoryContext(RemoveLiquidityContext, 'RemoveLiquidity')
