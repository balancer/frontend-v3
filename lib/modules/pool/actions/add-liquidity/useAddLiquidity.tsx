/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTokens } from '@/lib/modules/tokens/useTokens'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { isNativeAsset, isSameAddress, isWrappedNativeAsset } from '@/lib/shared/utils/addresses'
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
  requiresProportionalInput,
} from '../LiquidityActionHelpers'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { selectAddLiquidityHandler } from './handlers/selectAddLiquidityHandler'
import { useDisclosure } from '@chakra-ui/hooks'
import { useAddLiquidityStepConfigs } from './useAddLiquidityStepConfigs'
import { useIterateSteps } from '../../../transactions/transaction-steps/useIterateSteps'
import { useTokenInputsValidation } from '@/lib/modules/tokens/useTokenInputsValidation'
import { useTotalUsdValue } from './useTotalUsdValue'
import { isGyro } from '../../pool.helpers'
import { getNativeAssetAddress, getWrappedNativeAssetAddress } from '@/lib/config/app.config'
import { isNativeToken, isWrappedNativeToken } from '@/lib/modules/tokens/token.helpers'

export type UseAddLiquidityResponse = ReturnType<typeof _useAddLiquidity>
export const AddLiquidityContext = createContext<UseAddLiquidityResponse | null>(null)

export function _useAddLiquidity() {
  const [humanAmountsIn, setHumanAmountsIn] = useState<HumanAmountIn[]>([])
  const [humanAmountsInSDK, setHumanAmountsInSDK] = useState<HumanAmountIn[]>([])
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
  const inputAmounts = helpers.toInputAmounts(humanAmountsInSDK)
  const stepConfigs = useAddLiquidityStepConfigs(inputAmounts)
  const { currentStep, currentStepIndex, useOnStepCompleted } = useIterateSteps(stepConfigs)
  const chain = pool.chain
  const nativeAsset = getToken(getNativeAssetAddress(chain), chain)

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
    setHumanAmountsIn([
      ...humanAmountsIn.filter(
        amountIn =>
          !isSameAddress(amountIn.tokenAddress, tokenAddress) &&
          !(
            isNativeToken(tokenAddress, chain) && isWrappedNativeToken(amountIn.tokenAddress, chain)
          ) &&
          !(
            isNativeToken(amountIn.tokenAddress, chain) && isWrappedNativeToken(tokenAddress, chain)
          )
      ),
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
    if (token && isWrappedNativeAsset(chain, token.address as Address)) {
      return nativeAsset
    } else {
      return token
    }
  })

  const validTokens = tokens.filter((token): token is GqlToken => !!token)
  const containsWrappedNativeAsset = validTokens.some(token =>
    isWrappedNativeAsset(chain, token.address)
  )

  const { usdValueFor } = useTotalUsdValue(validTokens)

  useEffect(() => {
    setTotalUSDValue(usdValueFor(humanAmountsInSDK))
  }, [humanAmountsInSDK])

  /**
   * Simulation queries:
   */
  const simulationQuery = useAddLiquiditySimulationQuery(handler, humanAmountsInSDK)
  const priceImpactQuery = useAddLiquidityPriceImpactQuery(handler, humanAmountsInSDK)

  /**
   * Refetch logic:
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
    const amountsIn = humanAmountsIn.map(amountIn => {
      if (isNativeAsset(chain, amountIn.tokenAddress)) {
        return {
          ...amountIn,
          tokenAddress: getWrappedNativeAssetAddress(chain).toLowerCase() as Address,
        }
      } else {
        return amountIn
      }
    })
    setHumanAmountsInSDK(amountsIn)
  }, [humanAmountsIn])

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
    humanAmountsIn,
    inputAmounts,
    tokens: wethIsEth ? tokensWithNativeAsset : tokens,
    validTokens:
      containsWrappedNativeAsset && nativeAsset ? [...validTokens, nativeAsset] : validTokens,
    totalUSDValue,
    simulationQuery,
    priceImpactQuery,
    refetchQuote,
    isDisabled,
    disabledReason,
    previewModalDisclosure,
    currentStep,
    useOnStepCompleted,
    handler,
    setHumanAmountIn,
    setHumanAmountsIn,
    stepConfigs,
    currentStepIndex,
    helpers,
    setNeedsToAcceptHighPI,
    acceptPoolRisks,
    setAcceptPoolRisks,
    wethIsEth,
    setWethIsEth,
  }
}

export function AddLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useAddLiquidity()
  return <AddLiquidityContext.Provider value={hook}>{children}</AddLiquidityContext.Provider>
}

export const useAddLiquidity = (): UseAddLiquidityResponse =>
  useMandatoryContext(AddLiquidityContext, 'AddLiquidity')
