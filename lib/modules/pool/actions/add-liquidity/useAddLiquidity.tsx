/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTokens } from '@/lib/modules/tokens/useTokens'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { bn, safeSum } from '@/lib/shared/utils/numbers'
import { makeVar, useReactiveVar } from '@apollo/client'
import { HumanAmount } from '@balancer/sdk'
import { PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react'
import { Address } from 'viem'
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
import { useTokenAllowances } from '@/lib/modules/web3/useTokenAllowances'
import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { TransactionState } from '@/lib/shared/components/btns/transaction-steps/lib'

export type UseAddLiquidityResponse = ReturnType<typeof _useAddLiquidity>
export const AddLiquidityContext = createContext<UseAddLiquidityResponse | null>(null)

export const humanAmountsInVar = makeVar<HumanAmountIn[]>([])

export function _useAddLiquidity() {
  const humanAmountsIn = useReactiveVar(humanAmountsInVar)

  const { pool } = usePool()
  const { getToken, usdValueForToken } = useTokens()
  const { isConnected, userAddress } = useUserAccount()
  const vaultAddress = useContractAddress('balancer.vaultV2')
  const previewModalDisclosure = useDisclosure()

  const [addLiquidityTxState, setAddLiquidityTxState] = useState<TransactionState>()

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
  const tokenAddressesWithAmountIn = humanAmountsIn
    .filter(amountIn => bn(amountIn.humanAmount).gt(0))
    .map(amountIn => amountIn.tokenAddress)

  const tokenAllowances = useTokenAllowances(userAddress, vaultAddress, tokenAddressesWithAmountIn)

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

  /**
   * Simulation queries:
   */
  const simulationQuery = useAddLiquiditySimulationQuery(handler, humanAmountsIn, pool.id)

  const priceImpactQuery = useAddLiquidityPriceImpactQuery(handler, humanAmountsIn, pool.id)

  /**
   * Side-effects
   */
  // On initial render, set the initial humanAmountsIn
  useEffect(() => {
    setInitialHumanAmountsIn()
  }, [])

  return {
    humanAmountsIn,
    tokens,
    validTokens,
    totalUSDValue,
    simulationQuery,
    priceImpactQuery,
    isDisabled,
    disabledReason,
    helpers,
    previewModalDisclosure,
    setHumanAmountIn,
    tokenAllowances,
    handler,
    addLiquidityTxState,
    setAddLiquidityTxState,
  }
}

export function AddLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useAddLiquidity()
  return <AddLiquidityContext.Provider value={hook}>{children}</AddLiquidityContext.Provider>
}

export const useAddLiquidity = (): UseAddLiquidityResponse =>
  useMandatoryContext(AddLiquidityContext, 'AddLiquidity')
