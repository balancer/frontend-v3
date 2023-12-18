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
import { useAddLiquidityBtpOutQuery } from './queries/useAddLiquidityBtpOutQuery'
import { useAddLiquidityPriceImpactQuery } from './queries/useAddLiquidityPriceImpactQuery'
import { selectAddLiquidityHandler } from './handlers/selectAddLiquidityHandler'
import { HumanAmountIn } from '../liquidity-types'
import { LiquidityActionHelpers } from '../LiquidityActionHelpers'
import { useAddLiquidityDisabledWithReasons } from './useAddLiquidityDisabledWithReasons'
import { useBuildAddLiquidityQuery } from './queries/useBuildAddLiquidityTxQuery'

export type UseAddLiquidityResponse = ReturnType<typeof _useAddLiquidity>
export const AddLiquidityContext = createContext<UseAddLiquidityResponse | null>(null)

export const amountsInVar = makeVar<HumanAmountIn[]>([])

export function _useAddLiquidity() {
  const amountsIn = useReactiveVar(amountsInVar)

  const { pool, poolStateInput } = usePool()
  const { getToken, usdValueForToken } = useTokens()

  const handler = selectAddLiquidityHandler(pool)

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

  const { formattedPriceImpact, isPriceImpactLoading } = useAddLiquidityPriceImpactQuery(
    handler,
    amountsIn,
    pool.id
  )

  const { bptOut, bptOutUnits, isBptOutQueryLoading, lastSdkQueryOutput } =
    useAddLiquidityBtpOutQuery(handler, amountsIn, pool.id)

  const { isAddLiquidityDisabled, addLiquidityDisabledReason } =
    useAddLiquidityDisabledWithReasons(amountsIn)

  /* We don't expose individual helper methods like getAmountsToApprove or poolTokenAddresses because
    helper is a class and if we return its methods we would lose the this binding, getting a:
    TypeError: Cannot read property getAmountsToApprove of undefined
    when trying to access the returned method
    */
  const helpers = new LiquidityActionHelpers(pool)

  function useBuildTx(humanAmountsIn: HumanAmountIn[], isActiveStep: boolean) {
    return useBuildAddLiquidityQuery(
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
    formattedPriceImpact,
    isPriceImpactLoading,
    bptOut,
    isBptOutQueryLoading,
    bptOutUnits,
    setAmountIn,
    isAddLiquidityDisabled,
    addLiquidityDisabledReason,
    useBuildTx,
    helpers,
    poolStateInput,
    lastSdkQueryOutput,
  }
}

export function AddLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useAddLiquidity()
  return <AddLiquidityContext.Provider value={hook}>{children}</AddLiquidityContext.Provider>
}

export const useAddLiquidity = (): UseAddLiquidityResponse =>
  useMandatoryContext(AddLiquidityContext, 'AddLiquidity')
