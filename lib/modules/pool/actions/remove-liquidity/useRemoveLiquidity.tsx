/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTokens } from '@/lib/modules/tokens/useTokens'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { GqlPoolTokenExpanded, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { bn, safeSum } from '@/lib/shared/utils/numbers'
import { HumanAmount, TokenAmount } from '@balancer/sdk'
import { PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react'
import { usePool } from '../../usePool'
import { selectRemoveLiquidityHandler } from './handlers/selectRemoveLiquidityHandler'
import { useRemoveLiquiditySimulationQuery } from './queries/useRemoveLiquiditySimulationQuery'
import { useRemoveLiquidityPriceImpactQuery } from './queries/useRemoveLiquidityPriceImpactQuery'
import { RemoveLiquidityType } from './remove-liquidity.types'
import { Address } from 'viem'
import { shouldUseRecoveryRemoveLiquidity, toHumanAmount } from '../LiquidityActionHelpers'
import { useDisclosure } from '@chakra-ui/hooks'
import { TransactionState } from '@/lib/shared/components/btns/transaction-steps/lib'
import { useIterateSteps } from '../useIterateSteps'
import { useRemoveLiquidityStepConfigs } from './modal/useRemoveLiquidityStepConfigs'

export type UseRemoveLiquidityResponse = ReturnType<typeof _useRemoveLiquidity>
export const RemoveLiquidityContext = createContext<UseRemoveLiquidityResponse | null>(null)

export function _useRemoveLiquidity() {
  const { pool, bptPrice, refetch: refetchPoolUserBalances } = usePool()
  const { getToken, usdValueForToken } = useTokens()
  const { isConnected } = useUserAccount()

  const previewModalDisclosure = useDisclosure()

  const [removalType, setRemovalType] = useState<RemoveLiquidityType>(
    RemoveLiquidityType.Proportional
  )
  const [singleTokenAddress, setSingleTokenAddress] = useState<Address | undefined>(undefined)
  const [humanBptInPercent, setHumanBptInPercent] = useState<number>(100)
  const [didRefetchPool, setDidRefetchPool] = useState(false)

  // Quote state, fixed when remove liquidity tx goes into confirming/confirmed
  // state. This is required to maintain amounts in preview dialog on success.
  const [quoteBptIn, setQuoteBptIn] = useState<HumanAmount>('0')
  const [quoteAmountsOut, setQuoteAmountsOut] = useState<TokenAmount[]>([])
  const [quotePriceImpact, setQuotePriceImpact] = useState<number>()

  const maxHumanBptIn: HumanAmount = (pool?.userBalance?.totalBalance || '0') as HumanAmount
  const humanBptIn: HumanAmount = bn(maxHumanBptIn)
    .times(humanBptInPercent / 100)
    .toString() as HumanAmount

  const [removeLiquidityTxState, setRemoveLiquidityTxState] = useState<TransactionState>()

  const stepConfigs = useRemoveLiquidityStepConfigs(setRemoveLiquidityTxState)
  const { currentStep, useOnStepCompleted } = useIterateSteps(stepConfigs)

  const { isDisabled, disabledReason } = isDisabledWithReason(
    [!isConnected, LABELS.walletNotConnected],
    [Number(humanBptIn) === 0, 'You must specify a valid bpt in']
  )

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

  const tokenFilter = shouldUseRecoveryRemoveLiquidity(pool)
    ? (token: GqlPoolTokenExpanded) => !token.isNested
    : (token: GqlPoolTokenExpanded) => token.isMainToken

  const tokens = pool.allTokens
    .filter(tokenFilter)
    .map(token => getToken(token.address, pool.chain))

  const validTokens = tokens.filter((token): token is GqlToken => !!token)
  const firstTokenAddress = tokens?.[0]?.address as Address

  const singleTokenOutAddress = singleTokenAddress || firstTokenAddress

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
    singleTokenOutAddress
  )

  const priceImpactQuery = useRemoveLiquidityPriceImpactQuery(
    handler,
    pool.id,
    humanBptIn,
    singleTokenOutAddress
  )

  const amountOutMap: Record<Address, HumanAmount> = Object.fromEntries(
    quoteAmountsOut.map(tokenAmount => [tokenAmount.token.address, toHumanAmount(tokenAmount)])
  )

  const amountOutForToken = (tokenAddress: Address): HumanAmount => {
    const amountOut = amountOutMap[tokenAddress]
    return amountOut ? amountOut : '0'
  }

  const usdAmountOutMap: Record<Address, HumanAmount> = Object.fromEntries(
    quoteAmountsOut.map(tokenAmount => {
      const tokenAddress: Address = tokenAmount.token.address
      const token = getToken(tokenAddress, pool.chain)
      if (!token) throw new Error(`Token with address ${tokenAddress} was not found`)
      const tokenUnits = amountOutForToken(token.address as Address)
      return [tokenAddress, usdValueForToken(token, tokenUnits) as HumanAmount]
    })
  )

  const usdOutForToken = (tokenAddress: Address): HumanAmount => {
    const usdOut = usdAmountOutMap[tokenAddress]
    return usdOut ? usdOut : '0'
  }

  const totalUsdValue: string = safeSum(Object.values(usdAmountOutMap))

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

  return {
    tokens,
    validTokens,
    singleTokenOutAddress,
    humanBptIn,
    humanBptInPercent,
    quoteBptIn,
    quotePriceImpact,
    totalUsdFromBprPrice,
    isSingleToken,
    isProportional,
    totalUsdValue,
    simulationQuery,
    priceImpactQuery,
    isDisabled,
    disabledReason,
    previewModalDisclosure,
    removeLiquidityTxState,
    handler,
    currentStep,
    isTxConfirmingOrConfirmed,
    didRefetchPool,
    setRemovalType,
    setHumanBptInPercent,
    setProportionalType,
    setSingleTokenType,
    setSingleTokenAddress,
    amountOutForToken,
    usdOutForToken,
    setRemoveLiquidityTxState,
    useOnStepCompleted,
  }
}

export function RemoveLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useRemoveLiquidity()
  return <RemoveLiquidityContext.Provider value={hook}>{children}</RemoveLiquidityContext.Provider>
}

export const useRemoveLiquidity = (): UseRemoveLiquidityResponse =>
  useMandatoryContext(RemoveLiquidityContext, 'RemoveLiquidity')
