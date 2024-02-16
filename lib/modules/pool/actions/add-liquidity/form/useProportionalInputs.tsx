/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTokenBalances } from '@/lib/modules/tokens/useTokenBalances'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { bn } from '@/lib/shared/utils/numbers'
import { Address, HumanAmount } from '@balancer/sdk'
import { minBy } from 'lodash'
import { useEffect, useState } from 'react'
import { usePool } from '../../../usePool'
import { humanAmountsInVar, useAddLiquidity } from '../useAddLiquidity'
import { useTotalUsdValue } from '../useTotalUsdValue'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'

type TokenWithMinPrice = {
  tokenAddress: Address
  balancePrice: number
  userBalance: HumanAmount
}

export function useProportionalInputs() {
  const { isConnected } = useUserAccount()
  const { validTokens, helpers } = useAddLiquidity()
  const { usdValueFor } = useTotalUsdValue(validTokens)
  const { balanceFor, balances, isBalancesLoading } = useTokenBalances()
  const { priceForToken } = useTokens()
  const { isLoading: isPoolLoading } = usePool()
  const [isLoading, setIsLoading] = useState(true)
  const [isMaximized, setIsMaximized] = useState(false)
  const [maximizedUsdValue, setMaximizedUsdValue] = useState('')
  const [tokenWithMinPrice, setTokenWithMinPrice] = useState<TokenWithMinPrice | undefined>()

  function handleMaximizeUserAmounts() {
    if (!tokenWithMinPrice) return
    if (isMaximized) return setIsMaximized(false)
    handleHumanInputChange(tokenWithMinPrice.tokenAddress, tokenWithMinPrice.userBalance)
    setIsMaximized(true)
  }

  function handleHumanInputChange(tokenAddress: Address, humanAmount: HumanAmount) {
    // Checks if the user is entering the max amount for the tokenWithMinPrice
    const isMaximizing: boolean =
      tokenAddress === tokenWithMinPrice?.tokenAddress &&
      humanAmount === tokenWithMinPrice?.userBalance

    setIsMaximized(isMaximizing)

    const proportionalHumanAmountsIn = helpers.calculateProportionalHumanAmountsIn(
      tokenAddress,
      humanAmount
    )

    humanAmountsInVar(proportionalHumanAmountsIn)
  }

  useEffect(() => {
    // Once data is loaded, calculates and initializes state to maximize amounts
    if (isConnected && !isBalancesLoading && !isPoolLoading && balances.length > 0) {
      setIsLoading(true)
      const userTokenBalancePrices = validTokens.map(token => {
        const userBalance = balanceFor(token.address)?.formatted || 0
        return {
          tokenAddress: token.address,
          balancePrice: bn(userBalance).times(priceForToken(token)).toNumber(),
          userBalance,
        } as TokenWithMinPrice
      })

      const tokenWithMinPrice = minBy(userTokenBalancePrices, 'balancePrice')
      if (!tokenWithMinPrice) return

      setTokenWithMinPrice(tokenWithMinPrice)

      const maxProportionalHumanAmountsIn = helpers.calculateProportionalHumanAmountsIn(
        tokenWithMinPrice.tokenAddress as Address,
        tokenWithMinPrice.userBalance.toString() as HumanAmount
      )

      setMaximizedUsdValue(usdValueFor(maxProportionalHumanAmountsIn))

      setIsLoading(false)
    }
  }, [isConnected, isBalancesLoading, isPoolLoading, JSON.stringify(balances)])

  return {
    isLoading,
    isMaximized,
    maximizedUsdValue,
    handleHumanInputChange,
    handleMaximizeUserAmounts,
  }
}
