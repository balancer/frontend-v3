/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { bn } from '@/lib/shared/utils/numbers'
import { Address, HumanAmount, InputAmount, calculateProportionalAmounts } from '@balancer/sdk'
import { minBy } from 'lodash'
import { useState } from 'react'
import { usePool } from '../../../usePool'
import { useAddLiquidity } from '../useAddLiquidity'
import { useTotalUsdValue } from '../useTotalUsdValue'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { HumanAmountIn } from '../../liquidity-types'
import { formatUnits } from 'viem'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { LiquidityActionHelpers } from '../../LiquidityActionHelpers'

type TokenWithMinValue = {
  tokenAddress: Address
  balancePrice: number
  userBalance: HumanAmount
}

export function useProportionalInputs() {
  const { isConnected } = useUserAccount()
  const { validTokens, helpers, humanAmountsIn, setHumanAmountsIn } = useAddLiquidity()
  const { usdValueFor } = useTotalUsdValue(validTokens)
  const { balanceFor, balances, isBalancesLoading } = useTokenBalances()
  const { priceForToken } = useTokens()
  const { isLoading: isPoolLoading } = usePool()
  const [isMaximized, setIsMaximized] = useState(false)

  function clearAmountsIn() {
    setHumanAmountsIn(humanAmountsIn.map(amountIn => ({ ...amountIn, humanAmount: '' })))
  }

  function handleMaximizeUserAmounts() {
    if (!tokenWithMinValue) return
    if (isMaximized) return setIsMaximized(false)
    handleHumanInputChange(tokenWithMinValue.tokenAddress, tokenWithMinValue.userBalance)
    setIsMaximized(true)
  }

  function handleHumanInputChange(tokenAddress: Address, humanAmount: HumanAmount | '') {
    // Checks if the user is entering the max amount for the tokenWithMinValue
    const isMaximizing: boolean =
      tokenAddress === tokenWithMinValue?.tokenAddress &&
      humanAmount === tokenWithMinValue?.userBalance

    setIsMaximized(isMaximizing)

    if (!humanAmount) return clearAmountsIn()

    const proportionalHumanAmountsIn = _calculateProportionalHumanAmountsIn(
      tokenAddress,
      humanAmount,
      helpers
    )

    setHumanAmountsIn(proportionalHumanAmountsIn)
  }

  const shouldCalculateMaximizeAmounts =
    isConnected && !isBalancesLoading && !isPoolLoading && balances.length > 0

  function calculateTokenWithMinValue() {
    if (!shouldCalculateMaximizeAmounts) return
    const userTokenUsdValues = validTokens.map(token => {
      const userBalance = balanceFor(token.address)?.formatted || 0
      return {
        tokenAddress: token.address,
        balancePrice: bn(userBalance).times(priceForToken(token)).toNumber(),
        userBalance,
      } as TokenWithMinValue
    })

    return minBy(userTokenUsdValues, 'balancePrice')
  }

  const tokenWithMinValue: TokenWithMinValue | undefined = calculateTokenWithMinValue()

  function calculateMaximizedUsdValue() {
    if (!shouldCalculateMaximizeAmounts) return ''
    if (!tokenWithMinValue || tokenWithMinValue.balancePrice === 0) {
      //Avoid maximize calculations when the user does not have balance
      return ''
    }

    const maxProportionalHumanAmountsIn = _calculateProportionalHumanAmountsIn(
      tokenWithMinValue.tokenAddress as Address,
      tokenWithMinValue.userBalance.toString() as HumanAmount,
      helpers
    )
    return usdValueFor(maxProportionalHumanAmountsIn)
  }

  const maximizedUsdValue = calculateMaximizedUsdValue()

  const canMaximize = !!tokenWithMinValue?.userBalance

  return {
    canMaximize,
    isMaximized,
    maximizedUsdValue,
    handleHumanInputChange,
    handleMaximizeUserAmounts,
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
        humanAmount: formatUnits(rawAmount, decimals) as HumanAmount,
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
