/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTokens } from '@/lib/modules/tokens/useTokens'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { makeVar, useReactiveVar } from '@apollo/client'
import { HumanAmount } from '@balancer/sdk'
import { PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react'
import { Address, formatUnits } from 'viem'
import { usePool } from '../../usePool'
import { useAddLiquiditySimulationQuery } from './queries/useAddLiquiditySimulationQuery'
import { useAddLiquidityPriceImpactQuery } from './queries/useAddLiquidityPriceImpactQuery'
import { HumanAmountIn } from '../liquidity-types'
import { LiquidityActionHelpers, areEmptyAmounts } from '../LiquidityActionHelpers'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { selectAddLiquidityHandler } from './handlers/selectAddLiquidityHandler'
import { useDisclosure } from '@chakra-ui/hooks'
import { TransactionState } from '@/lib/shared/components/btns/transaction-steps/lib'
import { useAddLiquidityStepConfigs } from './useAddLiquidityStepConfigs'
import { useIterateSteps } from '../useIterateSteps'
import { useTotalUsdValue } from './useTotalUsdValue'
import { SdkQueryAddLiquidityOutput } from './add-liquidity.types'

export type UseAddLiquidityResponse = ReturnType<typeof _useAddLiquidity>
export const AddLiquidityContext = createContext<UseAddLiquidityResponse | null>(null)

export const humanAmountsInVar = makeVar<HumanAmountIn[]>([])

export function _useAddLiquidity() {
  const humanAmountsIn = useReactiveVar(humanAmountsInVar)

  const { pool } = usePool()
  const { getToken } = useTokens()
  const { isConnected } = useUserAccount()
  const previewModalDisclosure = useDisclosure()

  const [addLiquidityTxState, setAddLiquidityTxState] = useState<TransactionState>()

  const { isDisabled, disabledReason } = isDisabledWithReason(
    [!isConnected, LABELS.walletNotConnected],
    [areEmptyAmounts(humanAmountsIn), 'You must specify one or more token amounts']
  )

  const handler = useMemo(() => selectAddLiquidityHandler(pool), [pool.id])

  /**
   * Helper functions & variables
   */
  const helpers = new LiquidityActionHelpers(pool)
  const inputAmounts = helpers.toInputAmounts(humanAmountsIn)

  const stepConfigs = useAddLiquidityStepConfigs(inputAmounts, setAddLiquidityTxState)
  const { currentStep, useOnStepCompleted } = useIterateSteps(stepConfigs)

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

  const sdkSimulatedData: SdkQueryAddLiquidityOutput =
    simulationQuery.data as unknown as SdkQueryAddLiquidityOutput

  let sdkSimulatedAmounts
  if (sdkSimulatedData) {
    sdkSimulatedAmounts = sdkSimulatedData.sdkQueryOutput.amountsIn.map(({ amount, token }) => ({
      // token: token.address,
      amount: formatUnits(amount, token.decimals),
    }))
  }

  const priceImpactQuery = useAddLiquidityPriceImpactQuery(handler, humanAmountsIn)

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
    sdkSimulatedAmounts,
    priceImpactQuery,
    isDisabled,
    disabledReason,
    previewModalDisclosure,
    currentStep,
    useOnStepCompleted,
    handler,
    addLiquidityTxState,
    setHumanAmountIn,
    setAddLiquidityTxState,
    helpers,
  }
}

export function AddLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useAddLiquidity()
  return <AddLiquidityContext.Provider value={hook}>{children}</AddLiquidityContext.Provider>
}

export const useAddLiquidity = (): UseAddLiquidityResponse =>
  useMandatoryContext(AddLiquidityContext, 'AddLiquidity')
