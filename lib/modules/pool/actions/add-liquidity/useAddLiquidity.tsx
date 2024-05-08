/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTokens } from '@/lib/modules/tokens/useTokens'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { HumanAmount } from '@balancer/sdk'
import { PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react'
import { Address } from 'viem'
import { usePool } from '../../usePool'
import { useAddLiquiditySimulationQuery } from './queries/useAddLiquiditySimulationQuery'
import { useAddLiquidityPriceImpactQuery } from './queries/useAddLiquidityPriceImpactQuery'
import { HumanAmountIn } from '../liquidity-types'
import {
  LiquidityActionHelpers,
  areEmptyAmounts,
  filterHumanAmountsIn,
  requiresProportionalInput,
} from '../LiquidityActionHelpers'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { selectAddLiquidityHandler } from './handlers/selectAddLiquidityHandler'
import { useDisclosure } from '@chakra-ui/hooks'
import { useTokenInputsValidation } from '@/lib/modules/tokens/useTokenInputsValidation'
import { useTotalUsdValue } from './useTotalUsdValue'
import { isGyro } from '../../pool.helpers'
import { getNativeAssetAddress, getWrappedNativeAssetAddress } from '@/lib/config/app.config'
import { isWrappedNativeAsset } from '@/lib/modules/tokens/token.helpers'
import { useAddLiquiditySteps } from './useAddLiquiditySteps'
import { useAddLiquidityBuildCallDataQuery } from './queries/useAddLiquidityBuildCallDataQuery'
import { useTransactionSteps } from '@/lib/modules/transactions/transaction-steps/useTransactionSteps'

export type UseAddLiquidityResponse = ReturnType<typeof _useAddLiquidity>
export const AddLiquidityContext = createContext<UseAddLiquidityResponse | null>(null)

export function _useAddLiquidity() {
  const [humanAmountsIn, setHumanAmountsIn] = useState<HumanAmountIn[]>([])
  const [needsToAcceptHighPI, setNeedsToAcceptHighPI] = useState(false)
  const [acceptPoolRisks, setAcceptPoolRisks] = useState(false)
  const [wethIsEth, setWethIsEth] = useState(false)
  const [totalUSDValue, setTotalUSDValue] = useState('0')

  const { pool, refetch: refetchPool } = usePool()
  const { getToken } = useTokens()
  const { isConnected } = useUserAccount()
  const previewModalDisclosure = useDisclosure()
  const { hasValidationErrors } = useTokenInputsValidation()

  const handler = useMemo(() => selectAddLiquidityHandler(pool), [pool.id])

  /**
   * Helper functions & variables
   */
  const helpers = new LiquidityActionHelpers(pool)
  const inputAmounts = useMemo(() => helpers.toInputAmounts(humanAmountsIn), [humanAmountsIn])

  const chain = pool.chain
  const nativeAsset = getToken(getNativeAssetAddress(chain), chain)
  const wNativeAsset = getToken(getWrappedNativeAssetAddress(chain), chain)

  function setInitialHumanAmountsIn() {
    const amountsIn = pool.allTokens.map(
      token =>
        ({
          tokenAddress: token.address,
          humanAmount: '',
        } as HumanAmountIn)
    )
    setHumanAmountsIn(amountsIn)
  }

  function setHumanAmountIn(tokenAddress: Address, humanAmount: HumanAmount | '') {
    const amountsIn = filterHumanAmountsIn(humanAmountsIn, tokenAddress, chain)
    setHumanAmountsIn([
      ...amountsIn,

      {
        tokenAddress,
        humanAmount,
      },
    ])
  }

  const tokens = pool.allTokens
    .filter(token => {
      if (isGyro(pool.type)) return true
      return token.isMainToken
    })
    .map(token => getToken(token.address, chain))

  const tokensWithNativeAsset = tokens.map(token => {
    if (token && isWrappedNativeAsset(token.address as Address, chain)) {
      return nativeAsset
    } else {
      return token
    }
  })

  let validTokens = tokens.filter((token): token is GqlToken => !!token)
  validTokens = nativeAsset ? [nativeAsset, ...validTokens] : validTokens

  const { usdValueFor } = useTotalUsdValue(validTokens)

  useEffect(() => {
    setTotalUSDValue(usdValueFor(humanAmountsIn))
  }, [humanAmountsIn])

  /**
   * Simulation queries
   */
  const simulationQuery = useAddLiquiditySimulationQuery(handler, humanAmountsIn)
  const priceImpactQuery = useAddLiquidityPriceImpactQuery(handler, humanAmountsIn)
  const buildCallDataQuery = useAddLiquidityBuildCallDataQuery(
    handler,
    humanAmountsIn,
    simulationQuery
  )

  /**
   * Step construction
   */
  const steps = useAddLiquiditySteps(inputAmounts, simulationQuery, buildCallDataQuery)
  const transactionSteps = useTransactionSteps(steps)

  /**
   * Refetch logic
   */
  async function refetchQuote() {
    if (requiresProportionalInput(pool.type)) {
      /*
      This is the only edge-case where the SDK needs pool onchain data from the frontend
      (calculateProportionalAmounts uses pool.dynamicData.totalShares in its parameters)
      so we must refetch pool data
      */
      await refetchPool()
    }
    await Promise.all([simulationQuery.refetch(), priceImpactQuery.refetch()])
  }

  /**
   * Side-effects
   */
  // On initial render, set the initial humanAmountsIn
  useEffect(() => {
    setInitialHumanAmountsIn()
  }, [])

  useEffect(() => {
    // simulationQuery is refetched every 30 seconds by AddLiquidityTimeout
    if (simulationQuery.data) {
      buildCallDataQuery.refetch()
    }
  }, [simulationQuery.data])

  const { isDisabled, disabledReason } = isDisabledWithReason(
    [!isConnected, LABELS.walletNotConnected],
    [areEmptyAmounts(humanAmountsIn), 'You must specify one or more token amounts'],
    [hasValidationErrors, 'Errors in token inputs'],
    [needsToAcceptHighPI, 'Accept high price impact first'],
    [!acceptPoolRisks, 'Please accept the pool risks first'],
    [simulationQuery.isLoading, 'Fetching quote...'],
    [simulationQuery.isError, 'Error fetching quote'],
    [priceImpactQuery.isLoading, 'Fetching price impact...'],
    [priceImpactQuery.isError, 'Error fetching price impact']
  )

  return {
    transactionSteps,
    humanAmountsIn,
    inputAmounts,
    tokens: wethIsEth ? tokensWithNativeAsset : tokens,
    validTokens,
    totalUSDValue,
    simulationQuery,
    priceImpactQuery,
    isDisabled,
    disabledReason,
    previewModalDisclosure,
    handler,
    helpers,
    acceptPoolRisks,
    wethIsEth,
    nativeAsset,
    wNativeAsset,
    refetchQuote,
    setHumanAmountIn,
    setHumanAmountsIn,
    setNeedsToAcceptHighPI,
    setAcceptPoolRisks,
    setWethIsEth,
  }
}

export function AddLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useAddLiquidity()
  return <AddLiquidityContext.Provider value={hook}>{children}</AddLiquidityContext.Provider>
}

export const useAddLiquidity = (): UseAddLiquidityResponse =>
  useMandatoryContext(AddLiquidityContext, 'AddLiquidity')
