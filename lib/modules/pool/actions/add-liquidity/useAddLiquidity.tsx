/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTokens } from '@/lib/modules/tokens/useTokens'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { bn, safeSum } from '@/lib/shared/utils/numbers'
import { makeVar, useReactiveVar } from '@apollo/client'
import { HumanAmount } from '@balancer/sdk'
import { PropsWithChildren, createContext, useEffect, useMemo } from 'react'
import { Address } from 'viem'
import { usePool } from '../../usePool'
import { useAddLiquiditySimulationQuery } from './queries/useAddLiquiditySimulationQuery'
import { useAddLiquidityPriceImpactQuery } from './queries/useAddLiquidityPriceImpactQuery'
import { HumanAmountIn } from '../liquidity-types'
import { LiquidityActionHelpers, areEmptyAmounts } from '../LiquidityActionHelpers'
import { useAddLiquidityBuildCallDataQuery } from './queries/useAddLiquidityBuildCallDataQuery'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { selectAddLiquidityHandler } from './handlers/selectAddLiquidityHandler'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { useActiveStep } from '@/lib/shared/hooks/transaction-flows/useActiveStep'
import { useNextTokenApprovalStep } from '@/lib/modules/tokens/approvals/useNextTokenApprovalStep'
import { useDisclosure } from '@chakra-ui/hooks'
import { useTokenAllowances } from '@/lib/modules/web3/useTokenAllowances'
import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { useConstructAddLiquidityStep } from './useConstructAddLiquidityStep'

export type UseAddLiquidityResponse = ReturnType<typeof _useAddLiquidity>
export const AddLiquidityContext = createContext<UseAddLiquidityResponse | null>(null)

export const humanAmountsInVar = makeVar<HumanAmountIn[]>([])

export function _useAddLiquidity() {
  const humanAmountsIn = useReactiveVar(humanAmountsInVar)

  const {
    isActiveStep: isFinalStepActive,
    activateStep: activateFinalStep,
    deactivateStep: deactivateFinalStep,
  } = useActiveStep()
  const { pool, poolStateInput } = usePool()
  const { getToken, usdValueForToken, getTokensByTokenAddress } = useTokens()
  const { isConnected, userAddress } = useUserAccount()
  const vaultAddress = useContractAddress('balancer.vaultV2')
  const previewModalDisclosure = useDisclosure()

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
  const amountsInTokenAddresses = humanAmountsIn.map(h => h.tokenAddress)
  const amountsInTokensByAddress = getTokensByTokenAddress(amountsInTokenAddresses, pool.chain)

  const tokenAllowances = useTokenAllowances(userAddress, vaultAddress, tokenAddressesWithAmountIn)
  const { tokenApprovalStep, remainingAmountsToApprove } = useNextTokenApprovalStep({
    tokenAllowances,
    amountsToApprove: helpers.getAmountsToApprove(humanAmountsIn, amountsInTokensByAddress),
    actionType: 'AddLiquidity',
  })

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

  /**
   * The three handler queries, simulate + priceImpact + buildCallData.
   */
  const simulationQuery = useAddLiquiditySimulationQuery(handler, humanAmountsIn, pool.id)

  const priceImpactQuery = useAddLiquidityPriceImpactQuery(handler, humanAmountsIn, pool.id)

  const buildCallDataQuery = useAddLiquidityBuildCallDataQuery({
    handler,
    humanAmountsIn,
    pool,
    simulationQuery,
    options: {
      enabled: isFinalStepActive,
    },
  })

  /**
   * Transaction step construction
   */
  const { addLiquidityStep, addLiquidityTransaction } = useConstructAddLiquidityStep(
    pool.id,
    buildCallDataQuery,
    activateFinalStep
  )

  const steps = [tokenApprovalStep, addLiquidityStep].filter(step => step !== null) as FlowStep[]

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
    poolStateInput,
    buildCallDataQuery,
    remainingAmountsToApprove,
    previewModalDisclosure,
    tokenApprovalStep,
    addLiquidityTransaction,
    steps,
    isFinalStepActive,
    deactivateFinalStep,
    setHumanAmountIn,
  }
}

export function AddLiquidityProvider({ children }: PropsWithChildren) {
  const hook = _useAddLiquidity()
  return <AddLiquidityContext.Provider value={hook}>{children}</AddLiquidityContext.Provider>
}

export const useAddLiquidity = (): UseAddLiquidityResponse =>
  useMandatoryContext(AddLiquidityContext, 'AddLiquidity')
