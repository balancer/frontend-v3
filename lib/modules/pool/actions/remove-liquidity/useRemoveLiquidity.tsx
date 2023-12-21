'use client'

import { createContext, PropsWithChildren, useState } from 'react'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { usePool } from '../../usePool'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { GqlToken, GqlTokenAmountHumanReadable } from '@/lib/shared/services/api/generated/graphql'
import { LiquidityActionHelpers } from '../LiquidityActionHelpers'
import { bn } from '@/lib/shared/utils/numbers'
import { RemoveLiquidityType } from './remove-liquidity.types'
import { HumanAmount } from '@balancer/sdk'
import { noop } from 'lodash'

export type UseRemoveLiquidityResponse = ReturnType<typeof _useRemoveLiquidity>
export const RemoveLiquidityContext = createContext<UseRemoveLiquidityResponse | null>(null)

export function _useRemoveLiquidity() {
  const { pool, bptPrice } = usePool()
  const { getToken, usdValueForToken } = useTokens()

  const [removalType, setRemovalType] = useState<RemoveLiquidityType>(
    RemoveLiquidityType.Proportional
  )
  const [singleTokenAddress, setSingleTokenAddress] = useState<string | null>(null)
  const [singleTokenHumanAmount, setSingleTokenHumanAmount] = useState<HumanAmount | ''>('')

  const [sliderPercent, setSliderPercent] = useState<number>(100)

  // TODO: Pool User balance -> can we get it from the API?
  // const maxBptIn = pool.userBalance.totalBalance
  const maxBptIn = 1000
  const bptIn = maxBptIn * (sliderPercent / 100)

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

  const helpers = new LiquidityActionHelpers(pool)

  //TODO: hook up query hooks
  const useBuildTx = noop

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
    helpers,
    useBuildTx,
  }
}

export function RemoveLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useRemoveLiquidity()
  return <RemoveLiquidityContext.Provider value={hook}>{children}</RemoveLiquidityContext.Provider>
}

export const useRemoveLiquidity = (): UseRemoveLiquidityResponse =>
  useMandatoryContext(RemoveLiquidityContext, 'RemoveLiquidity')
