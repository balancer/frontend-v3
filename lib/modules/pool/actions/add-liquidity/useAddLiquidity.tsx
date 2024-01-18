/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTokens } from '@/lib/modules/tokens/useTokens'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { safeSum } from '@/lib/shared/utils/numbers'
import { makeVar, useReactiveVar } from '@apollo/client'
import { HumanAmount } from '@balancer/sdk'
import { PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react'
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
import { useRefetchCountdown } from '@/lib/shared/hooks/useRefetchCountdown'
import { TransactionState } from '@/lib/shared/components/btns/transaction-steps/lib'
import { useActiveStep } from '@/lib/shared/hooks/transaction-flows/useActiveStep'

export type UseAddLiquidityResponse = ReturnType<typeof _useAddLiquidity>
export const AddLiquidityContext = createContext<UseAddLiquidityResponse | null>(null)

export const humanAmountsInVar = makeVar<HumanAmountIn[]>([])

export function _useAddLiquidity() {
  const humanAmountsIn = useReactiveVar(humanAmountsInVar)
  const [isComplete, setIsComplete] = useState(false)
  const [addLiquidityTransactionState, setAddLiquidityTransactionState] =
    useState<TransactionState>()

  const { isActiveStep, activateStep } = useActiveStep()
  const { pool, poolStateInput } = usePool()
  const { getToken, usdValueForToken } = useTokens()
  const { isConnected } = useUserAccount()
  const { secondsToRefetch, startRefetchCountdown, stopRefetchCountdown } = useRefetchCountdown()
  const { isDisabled, disabledReason } = isDisabledWithReason(
    [!isConnected, LABELS.walletNotConnected],
    [areEmptyAmounts(humanAmountsIn), 'You must specify one or more token amounts']
  )

  const handler = useMemo(() => selectAddLiquidityHandler(pool), [pool.id])
  /**
   * We don't expose individual helper methods like getAmountsToApprove or poolTokenAddresses because
   * helper is a class and if we return its methods we would lose the this binding, getting a:
   * TypeError: Cannot read property getAmountsToApprove of undefined
   * when trying to access the returned method
   */
  const helpers = new LiquidityActionHelpers(pool)

  /**
   * Helper functions & variables
   */
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

  const isConfirmingAddLiquidity = addLiquidityTransactionState === TransactionState.Confirming

  // If the flow is complete or the final add liquidity transaction is
  // confirming, disable queries and updates to state.
  const shouldFreezeQuote = isComplete || isConfirmingAddLiquidity

  /**
   * The three handler queries, simulate + priceImpact + buildCallData.
   */
  const {
    isPreviewQueryLoading,
    bptOut,
    refetchPreviewQuery,
    data: queryAddLiquidityOutput,
  } = useAddLiquidityPreviewQuery(handler, humanAmountsIn, pool.id, {
    enabled: !shouldFreezeQuote,
  })

  const { isPriceImpactLoading, priceImpact, refetchPriceImpact } = useAddLiquidityPriceImpactQuery(
    handler,
    humanAmountsIn,
    pool.id,
    {
      enabled: !shouldFreezeQuote,
    }
  )

  const buildCallDataQuery = useAddLiquidityBuildCallDataQuery({
    handler,
    humanAmountsIn,
    isActiveStep,
    pool,
    startRefetchCountdown,
    queryAddLiquidityOutput,
    options: {
      enabled: !shouldFreezeQuote && isActiveStep,
    },
  })

  /**
   * Side-effects
   */
  // When the countdown timer reaches 0, refetch the simulate and priceImpact queries.
  useEffect(() => {
    const refetchQueries = async () => {
      stopRefetchCountdown()
      await Promise.all([refetchPreviewQuery(), refetchPriceImpact()])
      await buildCallDataQuery.refetch()
      startRefetchCountdown()
    }
    if (secondsToRefetch === 0 && !shouldFreezeQuote) refetchQueries()
  }, [secondsToRefetch])

  useEffect(() => {
    console.log('Build call data query success: ', buildCallDataQuery.data)
    if (buildCallDataQuery.data) {
      startRefetchCountdown()
    }
  }, [buildCallDataQuery.data])

  // If the transaction flow is complete, stop the countdown timer.
  useEffect(() => {
    if (shouldFreezeQuote) {
      stopRefetchCountdown()
    }
  }, [shouldFreezeQuote])

  // On initial render, set the initial humanAmountsIn
  useEffect(() => {
    setInitialHumanAmountsIn()
  }, [])

  return {
    activateStep,
    humanAmountsIn,
    tokens,
    validTokens,
    totalUSDValue,
    isPriceImpactLoading,
    priceImpact,
    bptOut,
    isPreviewQueryLoading,
    isDisabled,
    disabledReason,
    helpers,
    poolStateInput,
    secondsToRefetch,
    isComplete,
    shouldFreezeQuote,
    addLiquidityTransactionState,
    buildCallDataQuery,
    setAddLiquidityTransactionState,
    setHumanAmountIn,
    stopRefetchCountdown,
    setIsComplete,
  }
}

export function AddLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useAddLiquidity()
  return <AddLiquidityContext.Provider value={hook}>{children}</AddLiquidityContext.Provider>
}

export const useAddLiquidity = (): UseAddLiquidityResponse =>
  useMandatoryContext(AddLiquidityContext, 'AddLiquidity')
