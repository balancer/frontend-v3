/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTokens } from '@/lib/modules/tokens/useTokens'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { GqlPoolTokenExpanded, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { bn, safeSum } from '@/lib/shared/utils/numbers'
import { HumanAmount, TokenAmount, isSameAddress } from '@balancer/sdk'
import { PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react'
import { usePool } from '../../usePool'
import { selectRemoveLiquidityHandler } from './handlers/selectRemoveLiquidityHandler'
import { useRemoveLiquiditySimulationQuery } from './queries/useRemoveLiquiditySimulationQuery'
import { useRemoveLiquidityPriceImpactQuery } from './queries/useRemoveLiquidityPriceImpactQuery'
import { RemoveLiquidityType } from './remove-liquidity.types'
import { Address } from 'viem'
import { toHumanAmount } from '../LiquidityActionHelpers'
import { useDisclosure } from '@chakra-ui/hooks'
import { hasNestedPools, isGyro } from '../../pool.helpers'
import { getNativeAssetAddress, getWrappedNativeAssetAddress } from '@/lib/config/app.config'
import { isWrappedNativeAsset } from '@/lib/modules/tokens/token.helpers'
import { useRemoveLiquidityBuildCallDataQuery } from './queries/useRemoveLiquidityBuildCallDataQuery'
import { useRemoveLiquiditySteps } from './modal/useRemoveLiquiditySteps'
import { useTransactionSteps } from '@/lib/modules/transactions/transaction-steps/useTransactionSteps'

export type UseRemoveLiquidityResponse = ReturnType<typeof _useRemoveLiquidity>
export const RemoveLiquidityContext = createContext<UseRemoveLiquidityResponse | null>(null)

export function _useRemoveLiquidity() {
  const [singleTokenAddress, setSingleTokenAddress] = useState<Address | undefined>(undefined)
  const [humanBptInPercent, setHumanBptInPercent] = useState<number>(100)
  const [wethIsEth, setWethIsEth] = useState(false)
  const [needsToAcceptHighPI, setNeedsToAcceptHighPI] = useState(false)
  const [removalType, setRemovalType] = useState<RemoveLiquidityType>(
    RemoveLiquidityType.Proportional
  )

  // Quote state, fixed when remove liquidity tx goes into confirming/confirmed
  // state. This is required to maintain amounts in preview dialog on success.
  const [quoteBptIn, setQuoteBptIn] = useState<HumanAmount>('0')
  const [quoteAmountsOut, setQuoteAmountsOut] = useState<TokenAmount[]>([])
  const [quotePriceImpact, setQuotePriceImpact] = useState<number>()

  const { pool, bptPrice } = usePool()
  const { getToken, usdValueForToken } = useTokens()
  const { isConnected } = useUserAccount()
  const previewModalDisclosure = useDisclosure()

  const maxHumanBptIn: HumanAmount = (pool?.userBalance?.totalBalance || '0') as HumanAmount
  const humanBptIn: HumanAmount = bn(maxHumanBptIn)
    .times(humanBptInPercent / 100)
    .toFixed() as HumanAmount

  const chain = pool.chain
  const nativeAsset = getToken(getNativeAssetAddress(chain), chain)
  const wNativeAsset = getToken(getWrappedNativeAssetAddress(chain), chain)

  const handler = useMemo(
    () => selectRemoveLiquidityHandler(pool, removalType),
    [pool.id, removalType]
  )

  const totalUsdFromBprPrice = bn(humanBptIn).times(bptPrice).toFixed(2)

  const setProportionalType = () => setRemovalType(RemoveLiquidityType.Proportional)
  const setSingleTokenType = () => setRemovalType(RemoveLiquidityType.SingleToken)
  const isSingleToken = removalType === RemoveLiquidityType.SingleToken
  const isProportional = removalType === RemoveLiquidityType.Proportional

  const tokenFilter = hasNestedPools(pool)
    ? (token: GqlPoolTokenExpanded) => !token.isNested
    : (token: GqlPoolTokenExpanded) => isGyro(pool.type) || token.isMainToken

  const tokens = pool.allTokens
    .filter(tokenFilter)
    .map(token => getToken(token.address, pool.chain))

  const tokensWithNativeAsset = tokens.map(token => {
    if (token && isWrappedNativeAsset(token.address as Address, chain)) {
      return nativeAsset
    } else {
      return token
    }
  })

  const tokensToShow =
    isSingleToken && nativeAsset
      ? [...tokens, nativeAsset] // for single token we show both the native asset AND the wrapped native asset in the ui
      : wethIsEth
      ? tokensWithNativeAsset // else if wethIsEth we only show the native asset
      : tokens

  let validTokens = tokens.filter((token): token is GqlToken => !!token)
  validTokens = nativeAsset ? [nativeAsset, ...validTokens] : validTokens

  const firstTokenAddress = tokens?.[0]?.address as Address

  const singleTokenOutAddress = singleTokenAddress || firstTokenAddress

  /**
   * Queries
   */
  const simulationQuery = useRemoveLiquiditySimulationQuery(
    handler,
    pool.id,
    humanBptIn,
    wethIsEth && wNativeAsset ? (wNativeAsset.address as Address) : singleTokenOutAddress
  )

  const priceImpactQuery = useRemoveLiquidityPriceImpactQuery(
    handler,
    pool.id,
    humanBptIn,
    wethIsEth && wNativeAsset ? (wNativeAsset.address as Address) : singleTokenOutAddress
  )

  const buildCallDataQuery = useRemoveLiquidityBuildCallDataQuery({
    humanBptIn,
    handler,
    simulationQuery,
    singleTokenOutAddress,
    wethIsEth,
  })

  /**
   * Step construction
   */
  const steps = useRemoveLiquiditySteps(simulationQuery, buildCallDataQuery)
  const transactionSteps = useTransactionSteps(steps)

  /**
   * Methods
   */
  const amountOutForToken = (tokenAddress: Address): HumanAmount => {
    const amountOut = amountOutMap[tokenAddress]
    return amountOut ? amountOut : '0'
  }

  const usdOutForToken = (tokenAddress: Address): HumanAmount => {
    const usdOut = usdAmountOutMap[tokenAddress]
    return usdOut ? usdOut : '0'
  }

  function updateQuoteState(
    bptIn: HumanAmount,
    amountsOut: TokenAmount[] | undefined,
    priceImpact: number | undefined
  ) {
    setQuoteBptIn(bptIn)
    if (amountsOut) setQuoteAmountsOut(amountsOut)
    if (priceImpact) setQuotePriceImpact(priceImpact)
  }

  /**
   * Derived state
   */
  const amountOutMap: Record<Address, HumanAmount> = Object.fromEntries(
    quoteAmountsOut.map(tokenAmount => [
      wethIsEth &&
      wNativeAsset &&
      nativeAsset &&
      isSameAddress(tokenAmount.token.address, wNativeAsset.address as Address)
        ? nativeAsset.address
        : tokenAmount.token.address,
      toHumanAmount(tokenAmount),
    ])
  )

  const usdAmountOutMap: Record<Address, HumanAmount> = Object.fromEntries(
    quoteAmountsOut.map(tokenAmount => {
      const tokenAddress: Address = tokenAmount.token.address
      const token = getToken(tokenAddress, pool.chain)
      if (!token) return [tokenAddress, '0'] // Ignore BPT token addresses included in SDK amountsOut
      const tokenUnits = amountOutForToken(token.address as Address)
      return [tokenAddress, usdValueForToken(token, tokenUnits) as HumanAmount]
    })
  )

  const totalUSDValue: string = safeSum(Object.values(usdAmountOutMap))

  const { isDisabled, disabledReason } = isDisabledWithReason(
    [!isConnected, LABELS.walletNotConnected],
    [Number(humanBptIn) === 0, 'You must specify a valid bpt in'],
    [needsToAcceptHighPI, 'Accept high price impact first'],
    [simulationQuery.isLoading, 'Fetching quote...'],
    [simulationQuery.isError, 'Error fetching quote'],
    [priceImpactQuery.isLoading, 'Fetching price impact...'],
    [priceImpactQuery.isError, 'Error fetching price impact']
  )

  /**
   * Side-effects
   */
  // If amounts change, update quote state unless the final transaction is
  // confirming or confirmed.
  useEffect(() => {
    console.log('updateQuoteState')

    if (!transactionSteps.lastTransactionConfirmingOrConfirmed) {
      updateQuoteState(humanBptIn, simulationQuery.data?.amountsOut, priceImpactQuery.data)
    }
  }, [
    humanBptIn,
    simulationQuery.data,
    priceImpactQuery.data,
    transactionSteps.lastTransactionState,
  ])

  useEffect(() => {
    // simulationQuery is refetched every 30 seconds by RemoveLiquidityTimeout
    if (simulationQuery.data) {
      buildCallDataQuery.refetch()
    }
  }, [simulationQuery.data])

  return {
    transactionSteps,
    tokens: tokensToShow,
    validTokens,
    singleTokenOutAddress,
    humanBptIn,
    humanBptInPercent,
    quoteBptIn,
    quotePriceImpact,
    totalUsdFromBprPrice,
    isSingleToken,
    isProportional,
    totalUSDValue,
    simulationQuery,
    priceImpactQuery,
    buildCallDataQuery,
    isDisabled,
    disabledReason,
    previewModalDisclosure,
    handler,
    wethIsEth,
    setRemovalType,
    setHumanBptInPercent,
    setProportionalType,
    setSingleTokenType,
    setSingleTokenAddress,
    amountOutForToken,
    usdOutForToken,
    setNeedsToAcceptHighPI,
    setWethIsEth,
    updateQuoteState,
  }
}

export function RemoveLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useRemoveLiquidity()
  return <RemoveLiquidityContext.Provider value={hook}>{children}</RemoveLiquidityContext.Provider>
}

export const useRemoveLiquidity = (): UseRemoveLiquidityResponse =>
  useMandatoryContext(RemoveLiquidityContext, 'RemoveLiquidity')
