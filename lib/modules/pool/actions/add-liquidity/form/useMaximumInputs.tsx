/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTokenBalances } from '@/lib/modules/tokens/TokenBalancesProvider'
import { useTokens } from '@/lib/modules/tokens/TokensProvider'
import { useUserAccount } from '@/lib/modules/web3/UserAccountProvider'
import { bn } from '@/lib/shared/utils/numbers'
import { Address, HumanAmount, Slippage } from '@balancer/sdk'
import { useMemo, useState } from 'react'
import { usePool } from '../../../PoolProvider'
import { useAddLiquidity } from '../AddLiquidityProvider'
import { useTotalUsdValue } from '@/lib/modules/tokens/useTotalUsdValue'
import { TokenAmount } from '@/lib/modules/tokens/token.types'
import { formatUnits } from 'viem'

export function useMaximumInputs() {
  const { isConnected } = useUserAccount()
  const {
    validTokens,
    setHumanAmountsIn,
    wethIsEth,
    nativeAsset,
    wNativeAsset,
    proportionalSlippage,
    isForcedProportionalAdd,
  } = useAddLiquidity()
  const { usdValueFor } = useTotalUsdValue(validTokens)
  const { balances, isBalancesLoading } = useTokenBalances()
  const { isLoading: isPoolLoading } = usePool()
  const { isLoadingTokenPrices } = useTokens()
  const [isMaximized, setIsMaximized] = useState(false)

  // Depending on if the user is using WETH or ETH, we need to filter out the
  // native asset or wrapped native asset.
  const nativeAssetFilter = (balance: TokenAmount) =>
    wethIsEth
      ? wNativeAsset && balance.address !== wNativeAsset.address
      : nativeAsset && balance.address !== nativeAsset.address

  // If forced proportional add, we need to adjust the balances to account for
  // the slippage setting. If slippage is > 0, we need to subtract the slippage
  // from the balance so that if slippage does occur the transaction doesn't revert.
  const adjustedBalances = (balance: TokenAmount) => {
    if (isForcedProportionalAdd) {
      console.log('isForcedProportionalAdd', isForcedProportionalAdd, proportionalSlippage)

      const slippage = Slippage.fromPercentage(proportionalSlippage as HumanAmount)
      const amount = slippage.applyTo(balance.amount, -1)

      return {
        ...balance,
        amount,
        formatted: formatUnits(amount, balance.decimals),
      }
    }

    return balance
  }

  const filteredBalances = useMemo(() => {
    return balances.filter(nativeAssetFilter).map(adjustedBalances)
  }, [wethIsEth, isBalancesLoading])

  function handleMaximizeUserAmounts() {
    if (isMaximized) return setIsMaximized(false)
    const amounts = filteredBalances
      .filter(balance => bn(balance.amount).gt(0))
      .map(balance => ({
        humanAmount: balance.formatted as HumanAmount,
        tokenAddress: balance.address as Address,
      }))
    setHumanAmountsIn(amounts)
    setIsMaximized(true)
  }

  const shouldCalculateMaximizeAmounts =
    isConnected && !isBalancesLoading && !isPoolLoading && balances.length > 0

  const maximizedUsdValue = useMemo(() => {
    if (!shouldCalculateMaximizeAmounts) return ''

    const maximumAmounts = filteredBalances.map(balance => ({
      humanAmount: balance.formatted as HumanAmount,
      tokenAddress: balance.address as Address,
    }))

    return usdValueFor(maximumAmounts)
  }, [shouldCalculateMaximizeAmounts, isLoadingTokenPrices, wethIsEth])

  const canMaximize = filteredBalances.some(balance => bn(balance.amount).gt(0))

  return {
    canMaximize,
    isMaximized,
    maximizedUsdValue,
    handleMaximizeUserAmounts,
    setIsMaximized,
  }
}
