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
import {
  TransactionState,
  removeLiquidityStepId,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { useIterateSteps } from '../../../transactions/transaction-steps/useIterateSteps'
import { useRemoveLiquidityStepConfigs } from './modal/useRemoveLiquidityStepConfigs'
import { hasNestedPools, isGyro } from '../../pool.helpers'
import { useCurrentFlowStep } from '@/lib/modules/transactions/transaction-steps/useCurrentFlowStep'
import { getNativeAssetAddress, getWrappedNativeAssetAddress } from '@/lib/config/app.config'
import { isWrappedNativeAsset } from '@/lib/modules/tokens/token.helpers'

export type UseRemoveLiquidityResponse = ReturnType<typeof _useRemoveLiquidity>
export const RemoveLiquidityContext = createContext<UseRemoveLiquidityResponse | null>(null)

export function _useRemoveLiquidity() {
  const { pool, bptPrice, refetch: refetchPoolUserBalances } = usePool()
  const { getToken, usdValueForToken } = useTokens()
  const { isConnected } = useUserAccount()
  const [needsToAcceptHighPI, setNeedsToAcceptHighPI] = useState(false)
  const previewModalDisclosure = useDisclosure()

  const [removalType, setRemovalType] = useState<RemoveLiquidityType>(
    RemoveLiquidityType.Proportional
  )

  const [singleTokenAddress, setSingleTokenAddress] = useState<Address | undefined>(undefined)
  const [humanBptInPercent, setHumanBptInPercent] = useState<number>(100)
  const [didRefetchPool, setDidRefetchPool] = useState(false)
  const [wethIsEth, setWethIsEth] = useState(false)

  // Quote state, fixed when remove liquidity tx goes into confirming/confirmed
  // state. This is required to maintain amounts in preview dialog on success.
  const [quoteBptIn, setQuoteBptIn] = useState<HumanAmount>('0')
  const [quoteAmountsOut, setQuoteAmountsOut] = useState<TokenAmount[]>([])
  const [quotePriceImpact, setQuotePriceImpact] = useState<number>()

  const maxHumanBptIn: HumanAmount = (pool?.userBalance?.totalBalance || '0') as HumanAmount
  const humanBptIn: HumanAmount = bn(maxHumanBptIn)
    .times(humanBptInPercent / 100)
    .toFixed() as HumanAmount

  const stepConfigs = useRemoveLiquidityStepConfigs()
  const { currentStep, currentStepIndex, useOnStepCompleted } = useIterateSteps(stepConfigs)
  const { getCoreTransactionState, clearCurrentFlowStep } = useCurrentFlowStep()
  const chain = pool.chain
  const nativeAsset = getToken(getNativeAssetAddress(chain), chain)
  const wNativeAsset = getToken(getWrappedNativeAssetAddress(chain), chain)

  const handler = useMemo(
    () => selectRemoveLiquidityHandler(pool, removalType),
    [pool.id, removalType]
  )

  /**
   * Helper functions & variables
   */
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

  const removeLiquidityTxState = getCoreTransactionState(removeLiquidityStepId)

  const isTxConfirmingOrConfirmed =
    removeLiquidityTxState === TransactionState.Confirming ||
    removeLiquidityTxState === TransactionState.Completed

  const isRemoveLiquidityConfirmed = removeLiquidityTxState === TransactionState.Completed

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

  const amountOutForToken = (tokenAddress: Address): HumanAmount => {
    const amountOut = amountOutMap[tokenAddress]
    return amountOut ? amountOut : '0'
  }

  const usdAmountOutMap: Record<Address, HumanAmount> = Object.fromEntries(
    quoteAmountsOut.map(tokenAmount => {
      const tokenAddress: Address = tokenAmount.token.address
      const token = getToken(tokenAddress, pool.chain)
      if (!token) return [tokenAddress, '0'] // Ignore BPT token addresses included in SDK amountsOut
      const tokenUnits = amountOutForToken(token.address as Address)
      return [tokenAddress, usdValueForToken(token, tokenUnits) as HumanAmount]
    })
  )

  const usdOutForToken = (tokenAddress: Address): HumanAmount => {
    const usdOut = usdAmountOutMap[tokenAddress]
    return usdOut ? usdOut : '0'
  }

  const totalUSDValue: string = safeSum(Object.values(usdAmountOutMap))

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
   * Side-effects
   */
  useEffect(() => {
    clearCurrentFlowStep()
  }, [])

  // If amounts change, update quote state unless the final transaction is
  // confirming or confirmed.
  useEffect(() => {
    if (!isTxConfirmingOrConfirmed) {
      updateQuoteState(humanBptIn, simulationQuery.data?.amountsOut, priceImpactQuery.data)
    }
  }, [
    humanBptIn,
    JSON.stringify(simulationQuery.data?.amountsOut),
    priceImpactQuery.data,
    removeLiquidityTxState,
  ])

  // When the remove liquidity transaction is confirmed, refetch the user's pool
  // balances so that they are up to date when navigating back to the pool page.
  useEffect(() => {
    async function reFetchPool() {
      await refetchPoolUserBalances()
      setDidRefetchPool(true)
    }
    if (isRemoveLiquidityConfirmed) reFetchPool()
  }, [isRemoveLiquidityConfirmed])

  const { isDisabled, disabledReason } = isDisabledWithReason(
    [!isConnected, LABELS.walletNotConnected],
    [Number(humanBptIn) === 0, 'You must specify a valid bpt in'],
    [needsToAcceptHighPI, 'Accept high price impact first'],
    [simulationQuery.isLoading, 'Fetching quote...'],
    [simulationQuery.isError, 'Error fetching quote'],
    [priceImpactQuery.isLoading, 'Fetching price impact...'],
    [priceImpactQuery.isError, 'Error fetching price impact']
  )

  return {
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
    isDisabled,
    disabledReason,
    previewModalDisclosure,
    handler,
    stepConfigs,
    currentStep,
    currentStepIndex,
    isTxConfirmingOrConfirmed,
    didRefetchPool,
    wethIsEth,
    setRemovalType,
    setHumanBptInPercent,
    setProportionalType,
    setSingleTokenType,
    setSingleTokenAddress,
    amountOutForToken,
    usdOutForToken,
    useOnStepCompleted,
    setNeedsToAcceptHighPI,
    setWethIsEth,
  }
}

export function RemoveLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useRemoveLiquidity()
  return <RemoveLiquidityContext.Provider value={hook}>{children}</RemoveLiquidityContext.Provider>
}

export const useRemoveLiquidity = (): UseRemoveLiquidityResponse =>
  useMandatoryContext(RemoveLiquidityContext, 'RemoveLiquidity')
