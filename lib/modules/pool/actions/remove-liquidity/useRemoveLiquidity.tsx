/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTokens } from '@/lib/modules/tokens/useTokens'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { GqlToken, GqlTokenAmountHumanReadable } from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { bn, toBigInt } from '@/lib/shared/utils/numbers'
import { HumanAmount } from '@balancer/sdk'
import { PropsWithChildren, createContext, useMemo, useState } from 'react'
import { usePool } from '../../usePool'
import { isEmptyHumanAmount } from '../LiquidityActionHelpers'
import { selectRemoveLiquidityHandler } from './handlers/selectRemoveLiquidityHandler'
import { useBuildRemoveLiquidityQuery } from './queries/useBuildRemoveLiquidityTxQuery'
import { useRemoveLiquidityPreviewQuery } from './queries/useRemoveLiquidityPreviewQuery'
import { useRemoveLiquidityPriceImpactQuery } from './queries/useRemoveLiquidityPriceImpactQuery'
import { RemoveLiquidityType } from './remove-liquidity.types'

export type UseRemoveLiquidityResponse = ReturnType<typeof _useRemoveLiquidity>
export const RemoveLiquidityContext = createContext<UseRemoveLiquidityResponse | null>(null)

export function _useRemoveLiquidity() {
  const { pool, bptPrice } = usePool()
  const { getToken, usdValueForToken } = useTokens()
  const { isConnected } = useUserAccount()

  const [removalType, setRemovalType] = useState<RemoveLiquidityType>(
    RemoveLiquidityType.Proportional
  )
  const [singleTokenAddress, setSingleTokenAddress] = useState<string | null>(null)
  const [singleTokenHumanAmount, setSingleTokenHumanAmount] = useState<HumanAmount | ''>('')

  const [sliderPercent, setSliderPercent] = useState<number>(100)

  const handler = useMemo(() => selectRemoveLiquidityHandler(pool, removalType), [pool.id])

  // const maxBptIn = pool.userBalance.totalBalance
  // TODO: Hardcoded until it is ready in the API
  const maxBptIn = 1000
  const bptIn: bigint = toBigInt(bn(maxBptIn).times(sliderPercent / 100))

  const totalUsdValue = bn(bptIn).times(bptPrice).toString()

  function setProportionalAmounts(proportionalAmounts: GqlTokenAmountHumanReadable[]) {
    console.log({ proportionalAmounts })
  }

  const setProportional = () => setRemovalType(RemoveLiquidityType.Proportional)
  const setSingleToken = () => setRemovalType(RemoveLiquidityType.SingleToken)
  const isSingleToken = removalType === RemoveLiquidityType.SingleToken
  const isProportional = removalType === RemoveLiquidityType.Proportional

  const singleToken: GqlTokenAmountHumanReadable = {
    address: singleTokenAddress || '', //TODO remove null
    amount: singleTokenHumanAmount,
  }

  const tokens = pool.allTokens.map(token => getToken(token.address, pool.chain))
  const validTokens = tokens.filter((token): token is GqlToken => !!token)

  const { isPriceImpactLoading, priceImpact } = useRemoveLiquidityPriceImpactQuery(
    handler,
    pool.id,
    bptIn
  )

  const { amountsOut, isPreviewQueryLoading } = useRemoveLiquidityPreviewQuery(
    handler,
    pool.id,
    bptIn
  )

  function useBuildTx(isActiveStep: boolean) {
    return useBuildRemoveLiquidityQuery(handler, bptIn, isActiveStep, pool.id)
  }

  const { isDisabled, disabledReason } = isDisabledWithReason(
    [!isConnected, LABELS.walletNotConnected],
    [bptIn === 0n, 'You must specify a valid bpt in']
  )

  return {
    tokens,
    validTokens,
    setProportional,
    setProportionalAmounts,
    setSingleToken,
    setSingleTokenAddress,
    setSingleTokenHumanAmount,
    singleToken,
    singleTokenAddress,
    sliderPercent,
    setSliderPercent,
    isSingleToken,
    isProportional,
    setRemovalType,
    totalUsdValue,
    useBuildTx,
    isPreviewQueryLoading,
    isPriceImpactLoading,
    priceImpact,
    amountsOut,
    isDisabled,
    disabledReason,
  }
}

export function RemoveLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useRemoveLiquidity()
  return <RemoveLiquidityContext.Provider value={hook}>{children}</RemoveLiquidityContext.Provider>
}

export const useRemoveLiquidity = (): UseRemoveLiquidityResponse =>
  useMandatoryContext(RemoveLiquidityContext, 'RemoveLiquidity')
