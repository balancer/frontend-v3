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
import { useAddLiquidityPreviewQuery } from './queries/useAddLiquidityPreviewQuery'
import { useAddLiquidityPriceImpactQuery } from './queries/useAddLiquidityPriceImpactQuery'
import { HumanAmountIn } from '../liquidity-types'
import { LiquidityActionHelpers, areEmptyAmounts } from '../LiquidityActionHelpers'
import { useAddLiquidityBuildCallDataQuery } from './queries/useAddLiquidityBuildCallDataQuery'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { selectAddLiquidityHandler } from './handlers/selectAddLiquidityHandler'

export type UseAddLiquidityResponse = ReturnType<typeof _useAddLiquidity>
export const AddLiquidityContext = createContext<UseAddLiquidityResponse | null>(null)

export const humanAmountsInVar = makeVar<HumanAmountIn[]>([])

export function _useAddLiquidity() {
  const humanAmountsIn = useReactiveVar(humanAmountsInVar)

  const { pool, poolStateInput } = usePool()
  const { getToken, usdValueForToken } = useTokens()
  const { isConnected } = useUserAccount()

  const handler = useMemo(() => selectAddLiquidityHandler(pool), [pool.id])

  function setInitialHumanAmountsIn() {
    const amountsIn = pool.allTokens.map(
      token =>
        ({
          tokenAddress: token.address,
          humanAmount: '',
        } as HumanAmountIn)
    )
    humanAmountsInVar(amountsIn)
  }

  useEffect(() => {
    setInitialHumanAmountsIn()
  }, [])

  function setHumanAmountIn(tokenAddress: Address, humanAmount: HumanAmount) {
    const state = humanAmountsInVar()

    humanAmountsInVar([
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
      humanAmountsIn.map(amountIn => {
        const token = validTokens.find(token =>
          isSameAddress(token?.address, amountIn.tokenAddress)
        )

        if (!token) return '0'

        return usdValueForToken(token, amountIn.humanAmount)
      }),
    [humanAmountsIn, usdValueForToken, validTokens]
  )
  const totalUSDValue = safeSum(usdAmountsIn)

  const { isPriceImpactLoading, priceImpact } = useAddLiquidityPriceImpactQuery(
    handler,
    humanAmountsIn,
    pool.id
  )

  const {
    isPreviewQueryLoading,
    bptOut,
    data: previewQueryData,
  } = useAddLiquidityPreviewQuery(handler, humanAmountsIn, pool.id)

  const { isDisabled, disabledReason } = isDisabledWithReason(
    [!isConnected, LABELS.walletNotConnected],
    [areEmptyAmounts(humanAmountsIn), 'You must specify one or more token amounts']
  )

  /* We don't expose individual helper methods like getAmountsToApprove or poolTokenAddresses because
    helper is a class and if we return its methods we would lose the this binding, getting a:
    TypeError: Cannot read property getAmountsToApprove of undefined
    when trying to access the returned method
    */
  const helpers = new LiquidityActionHelpers(pool)

  function useBuildCallData(isActiveStep: boolean) {
    if (!previewQueryData) {
      console.error('Missing previewQueryData.')
      throw new Error(
        `Missing previewQueryData.
It looks that you tried to call useBuildCallData before the last query finished generating previewQueryData`
      )
    }

    return useAddLiquidityBuildCallDataQuery(
      handler,
      humanAmountsIn,
      isActiveStep,
      pool,
      previewQueryData
    )
  }

  return {
    humanAmountsIn,
    tokens,
    validTokens,
    totalUSDValue,
    isPriceImpactLoading,
    priceImpact,
    bptOut,
    isPreviewQueryLoading,
    setHumanAmountIn,
    useBuildCallData,
    isDisabled,
    disabledReason,
    helpers,
    poolStateInput,
  }
}

export function AddLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useAddLiquidity()
  return <AddLiquidityContext.Provider value={hook}>{children}</AddLiquidityContext.Provider>
}

export const useAddLiquidity = (): UseAddLiquidityResponse =>
  useMandatoryContext(AddLiquidityContext, 'AddLiquidity')
