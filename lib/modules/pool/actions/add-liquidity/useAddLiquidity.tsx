/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTokens } from '@/lib/modules/tokens/useTokens'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useRefetchCountdown } from '@/lib/shared/hooks/transaction-flows/useRefetchCountdown'
import { LABELS } from '@/lib/shared/labels'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { safeSum } from '@/lib/shared/utils/numbers'
import { sleep } from '@/lib/shared/utils/time'
import { makeVar, useReactiveVar } from '@apollo/client'
import { HumanAmount } from '@balancer/sdk'
import { PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react'
import { Address } from 'viem'
import { usePool } from '../../usePool'
import { LiquidityActionHelpers, areEmptyAmounts } from '../LiquidityActionHelpers'
import { HumanAmountIn } from '../liquidity-types'
import { selectAddLiquidityHandler } from './handlers/selectAddLiquidityHandler'
import { useAddLiquidityMixedQuery } from './queries/useAddLiquidityMixedQuery'
import { useAddLiquidityPriceImpactQuery } from './queries/useAddLiquidityPriceImpactQuery'

export type UseAddLiquidityResponse = ReturnType<typeof _useAddLiquidity>
export const AddLiquidityContext = createContext<UseAddLiquidityResponse | null>(null)

export const humanAmountsInVar = makeVar<HumanAmountIn[]>([])

export function _useAddLiquidity() {
  const [isBuildCallReady, setBuildCallReady] = useState(false)
  const humanAmountsIn = useReactiveVar(humanAmountsInVar)

  const { pool, poolStateInput } = usePool()
  const { getToken, usdValueForToken } = useTokens()
  const { isConnected } = useUserAccount()

  const handler = useMemo(() => selectAddLiquidityHandler(pool), [pool.id])

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

  useEffect(() => {
    setInitialHumanAmountsIn()
  }, [])

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

  const { isDisabled, disabledReason } = isDisabledWithReason(
    [!isConnected, LABELS.walletNotConnected],
    [areEmptyAmounts(humanAmountsIn), 'You must specify one or more token amounts']
  )

  const { isPriceImpactLoading, priceImpact, refetchPriceImpact } = useAddLiquidityPriceImpactQuery(
    handler,
    humanAmountsIn,
    pool.id
  )

  const { secondsToRefetch, startRefetchCountdown, stopRefetchCountdown } = useRefetchCountdown()

  const { bptOut, isMixedQueryLoading, refetchMixedQuery, transactionConfig, mixedQueryError } =
    useAddLiquidityMixedQuery(
      handler,
      humanAmountsIn,
      pool.id,
      isBuildCallReady,
      startRefetchCountdown
    )

  useEffect(() => {
    const refetchQueries = async () => {
      // TODO: remove after manual feature tests
      console.log('Refetching preview, priceImpact and build queries')
      stopRefetchCountdown()
      await sleep(1000) // TODO: Show some kind of UI feedback during this artificial delay
      await Promise.all([refetchMixedQuery(), refetchPriceImpact()])
      startRefetchCountdown()
    }
    if (secondsToRefetch === 0) {
      refetchQueries()
    }
  }, [secondsToRefetch])

  /* We don't expose individual helper methods like getAmountsToApprove or poolTokenAddresses because
    helper is a class and if we return its methods we would lose the this binding, getting a:
    TypeError: Cannot read property getAmountsToApprove of undefined
    when trying to access the returned method
    */
  const helpers = new LiquidityActionHelpers(pool)

  return {
    humanAmountsIn,
    tokens,
    validTokens,
    totalUSDValue,
    isPriceImpactLoading,
    priceImpact,
    bptOut,
    transactionConfig,
    mixedQueryError,
    isMixedQueryLoading,
    setHumanAmountIn,
    isDisabled,
    disabledReason,
    helpers,
    poolStateInput,
    secondsToRefetch,
    stopRefetchCountdown,
    setBuildCallReady,
  }
}

export function AddLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useAddLiquidity()
  return <AddLiquidityContext.Provider value={hook}>{children}</AddLiquidityContext.Provider>
}

export const useAddLiquidity = (): UseAddLiquidityResponse =>
  useMandatoryContext(AddLiquidityContext, 'AddLiquidity')
