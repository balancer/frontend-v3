/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { bn } from '@/lib/shared/utils/numbers'
import { Address, HumanAmount, InputAmount, calculateProportionalAmounts } from '@balancer/sdk'
import { useMemo, useState } from 'react'
import { formatUnits } from 'viem'
import { usePool } from '../../../usePool'
import { LiquidityActionHelpers, isEmptyHumanAmount } from '../../LiquidityActionHelpers'
import { HumanAmountIn } from '../../liquidity-types'
import { useAddLiquidity } from '../useAddLiquidity'
import { useTotalUsdValue } from '../useTotalUsdValue'

type OptimalToken = {
  tokenAddress: Address
  userBalance: HumanAmount
}

export function useProportionalInputs() {
  const { isConnected } = useUserAccount()
  const {
    validTokens,
    helpers,
    humanAmountsIn,
    setHumanAmountsIn,
    wethIsEth,
    nativeAsset,
    wNativeAsset,
  } = useAddLiquidity()
  const { usdValueFor } = useTotalUsdValue(validTokens)
  const { balanceFor, balances, isBalancesLoading } = useTokenBalances()
  const { isLoading: isPoolLoading } = usePool()
  const [isMaximized, setIsMaximized] = useState(false)
  const { prices } = useTokens()

  function clearAmountsIn() {
    setHumanAmountsIn(humanAmountsIn.map(amountIn => ({ ...amountIn, humanAmount: '' })))
  }

  function handleMaximizeUserAmounts() {
    if (!optimalToken) return
    if (isMaximized) return setIsMaximized(false)
    handleProportionalHumanInputChange(optimalToken.tokenAddress, optimalToken.userBalance)
    setIsMaximized(true)
  }

  function handleProportionalHumanInputChange(tokenAddress: Address, humanAmount: HumanAmount) {
    // Checks if the user is entering the max amount for the tokenWithMinValue
    const isMaximizing: boolean =
      tokenAddress === optimalToken?.tokenAddress && humanAmount === optimalToken?.userBalance

    setIsMaximized(isMaximizing)

    if (isEmptyHumanAmount(humanAmount)) return clearAmountsIn()

    const proportionalHumanAmountsIn = _calculateProportionalHumanAmountsIn(
      tokenAddress,
      humanAmount,
      helpers
    )

    const proportionalAmounts = proportionalHumanAmountsIn.map(amount => {
      if (wethIsEth && isSameAddress(amount.tokenAddress, wNativeAsset?.address as Address)) {
        return { ...amount, tokenAddress: nativeAsset?.address as Address }
      } else {
        return amount
      }
    })

    setHumanAmountsIn(proportionalAmounts)
  }

  const shouldCalculateMaximizeAmounts =
    isConnected && !isBalancesLoading && !isPoolLoading && balances.length > 0

  /*
    Finds the optimal token.
    A token is optimal when using its maximum user balance produces a valid proportional amounts result
    (where the rest of the tokens have enough user balance for that proportional result).
  */
  const optimalToken = useMemo((): OptimalToken | undefined => {
    if (!shouldCalculateMaximizeAmounts) return

    const humanBalanceFor = (tokenAddress: string): HumanAmount => {
      return (balanceFor(tokenAddress)?.formatted || '0') as HumanAmount
    }

    const optimalToken = validTokens.find(({ address }) => {
      const humanBalance = humanBalanceFor(address)
      if (isEmptyHumanAmount(humanBalance)) return false

      const proportionalAmounts = _calculateProportionalHumanAmountsIn(
        address as Address,
        humanBalance,
        helpers
      )

      // The user must have enough token balance for this proportional result
      const haveEnoughBalance = proportionalAmounts.every(({ tokenAddress, humanAmount }) => {
        return bn(humanBalanceFor(tokenAddress)).gte(bn(humanAmount))
      })

      return haveEnoughBalance
    })

    if (!optimalToken) return

    return {
      tokenAddress: optimalToken.address,
      userBalance: humanBalanceFor(optimalToken.address),
    } as OptimalToken
  }, [shouldCalculateMaximizeAmounts])

  const maximizedUsdValue = useMemo(() => {
    if (!shouldCalculateMaximizeAmounts || !optimalToken) return ''

    const maxProportionalHumanAmountsIn = _calculateProportionalHumanAmountsIn(
      optimalToken.tokenAddress as Address,
      optimalToken.userBalance,
      helpers
    )

    return usdValueFor(maxProportionalHumanAmountsIn)
  }, [shouldCalculateMaximizeAmounts, optimalToken, prices])

  const canMaximize = !!optimalToken?.userBalance

  return {
    canMaximize,
    isMaximized,
    maximizedUsdValue,
    handleProportionalHumanInputChange,
    handleMaximizeUserAmounts,
    setIsMaximized,
  }
}

export function _calculateProportionalHumanAmountsIn(
  tokenAddress: Address,
  humanAmount: HumanAmount,
  helpers: LiquidityActionHelpers
): HumanAmountIn[] {
  const amountIn: InputAmount = helpers.toInputAmounts([{ tokenAddress, humanAmount }])[0]
  return (
    calculateProportionalAmounts(helpers.poolStateWithBalances, amountIn)
      .tokenAmounts.map(({ address, rawAmount, decimals }) => ({
        tokenAddress: address,
        humanAmount: roundToFiveDecimals(formatUnits(rawAmount, decimals)) as HumanAmount,
      }))
      // user updated token must be in the first place of the array because the Proportional handler always calculates bptOut based on the first position
      .sort(sortUpdatedTokenFirst(tokenAddress))
  )

  function sortUpdatedTokenFirst(tokenAddress: Address | null) {
    return (a: HumanAmountIn, b: HumanAmountIn) => {
      if (!tokenAddress) return 0
      if (isSameAddress(a.tokenAddress, tokenAddress)) return -1
      if (isSameAddress(b.tokenAddress, tokenAddress)) return 1
      return 0
    }
  }
}

// If we pass more than 5 decimals the SDK priceImpact crashes due to some problem with ZeroDelta calculations
function roundToFiveDecimals(number: string) {
  return Number(number).toFixed(5)
}
