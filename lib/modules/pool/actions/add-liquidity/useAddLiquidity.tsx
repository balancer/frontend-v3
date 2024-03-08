/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTokens } from '@/lib/modules/tokens/useTokens'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
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
import { TransactionState } from '@/lib/modules/transactions/transaction-steps/lib'
import { useAddLiquidityStepConfigs } from './useAddLiquidityStepConfigs'
import { useIterateSteps } from '../useIterateSteps'
import { useTokenInputsValidation } from '@/lib/modules/tokens/useTokenInputsValidation'
import { useTotalUsdValue } from './useTotalUsdValue'

export type UseAddLiquidityResponse = ReturnType<typeof _useAddLiquidity>
export const AddLiquidityContext = createContext<UseAddLiquidityResponse | null>(null)

export function _useAddLiquidity() {
  const [humanAmountsIn, setHumanAmountsIn] = useState<HumanAmountIn[]>([])

  const { pool, refetch: refetchPool } = usePool()
  const { getToken } = useTokens()
  const { isConnected } = useUserAccount()
  const previewModalDisclosure = useDisclosure()

  const [addLiquidityTxState, setAddLiquidityTxState] = useState<TransactionState>()
  const { hasValidationErrors } = useTokenInputsValidation()

  const { isDisabled, disabledReason } = isDisabledWithReason(
    [!isConnected, LABELS.walletNotConnected],
    [areEmptyAmounts(humanAmountsIn), 'You must specify one or more token amounts'],
    [hasValidationErrors(), 'Errors in token inputs']
  )

  const handler = useMemo(() => selectAddLiquidityHandler(pool), [pool.id])

  /**
   * Helper functions & variables
   */
  const helpers = new LiquidityActionHelpers(pool)
  const inputAmounts = helpers.toInputAmounts(humanAmountsIn)

  const stepConfigs = useAddLiquidityStepConfigs(inputAmounts, setAddLiquidityTxState)
  const { currentStep, currentStepIndex, useOnStepCompleted } = useIterateSteps(stepConfigs)

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

  function setHumanAmountIn(tokenAddress: Address, humanAmount: HumanAmount) {
    setHumanAmountsIn([
      ...humanAmountsIn.filter(amountIn => !isSameAddress(amountIn.tokenAddress, tokenAddress)),
      {
        tokenAddress,
        humanAmount,
      },
    ])
  }

  const tokens = pool.allTokens
    .filter(token => token.isMainToken)
    .map(token => getToken(token.address, pool.chain))
  const validTokens = tokens.filter((token): token is GqlToken => !!token)

  const { usdValueFor } = useTotalUsdValue(validTokens)
  const totalUSDValue = usdValueFor(humanAmountsIn)

  /**
   * Simulation queries:
   */
  const simulationQuery = useAddLiquiditySimulationQuery(handler, humanAmountsIn)

  const priceImpactQuery = useAddLiquidityPriceImpactQuery(handler, humanAmountsIn)

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

  return {
    humanAmountsIn,
    inputAmounts,
    tokens,
    validTokens,
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
    addLiquidityTxState,
    setHumanAmountIn,
    setHumanAmountsIn,
    setAddLiquidityTxState,
    stepConfigs,
    currentStepIndex,
    helpers,
  }
}

export function AddLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useAddLiquidity()
  return <AddLiquidityContext.Provider value={hook}>{children}</AddLiquidityContext.Provider>
}

export const useAddLiquidity = (): UseAddLiquidityResponse =>
  useMandatoryContext(AddLiquidityContext, 'AddLiquidity')
