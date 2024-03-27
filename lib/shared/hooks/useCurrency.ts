'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useFxRates } from './useFxRates'
import { symbolForCurrency } from '../utils/currencies'
import { Numberish, bn, fNum } from '../utils/numbers'
import { useIsMounted } from './useIsMounted'

type CurrencyOpts = { withSymbol?: boolean; abbreviated?: boolean }

export function useCurrency() {
  const isMounted = useIsMounted()
  const { currency } = useUserSettings()
  const { getFxRate, hasFxRates } = useFxRates()

  // Converts a USD value to the user's currency value.
  function toUserCurrency(usdVal: Numberish): string {
    const amount = usdVal.toString()
    const fxRate = getFxRate(currency)

    return bn(amount).times(fxRate).toString()
  }

  function formatCurrency(value: string | undefined) {
    const symbol = hasFxRates ? symbolForCurrency(currency) : '$'
    return `${symbol}${value ?? '0'}`
  }

  function parseCurrency(value: string) {
    return value.replace(/^\$/, '')
  }

  // Converts a USD value to the user's currency and formats in fiat style.
  function toCurrency(
    usdVal: Numberish,
    { withSymbol = true, abbreviated = true }: CurrencyOpts = {}
  ): string {
    if (!isMounted) return '' // Need to wait for currency from local storage, otherwise hydration issues.

    const symbol = hasFxRates ? symbolForCurrency(currency) : '$'
    const convertedAmount = toUserCurrency(usdVal)
    const formattedAmount = fNum('fiat', convertedAmount, { abbreviated })

    return withSymbol ? symbol + formattedAmount : formattedAmount
  }

  return { toCurrency, formatCurrency, parseCurrency }
}
