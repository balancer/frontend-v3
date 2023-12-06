'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useFxRates } from './useFxRates'
import { symbolForCurrency } from '../utils/currencies'
import { Numberish, bn, fiatFormat } from '../utils/numbers'

type CurrencyOpts = { withSymbol?: boolean; abbreviated?: boolean }

export function useCurrency() {
  const { currency } = useUserSettings()
  const { getFxRate, hasFxRates } = useFxRates()

  // Converts a USD value to the user's currency value.
  function toUserCurrency(usdVal: Numberish): string {
    const amount = usdVal.toString()
    const fxRate = getFxRate(currency)

    return bn(amount).times(fxRate).toString()
  }

  // Converts a USD value to the user's currency and formats in fiat style.
  function toCurrency(
    usdVal: Numberish,
    { withSymbol = true, abbreviated = true }: CurrencyOpts = {}
  ): string {
    const symbol = hasFxRates ? symbolForCurrency(currency) : '$'
    const convertedAmount = toUserCurrency(usdVal)
    const formattedAmount = fiatFormat(convertedAmount, { abbreviated })

    return withSymbol ? symbol + formattedAmount : formattedAmount
  }

  return { toCurrency }
}
