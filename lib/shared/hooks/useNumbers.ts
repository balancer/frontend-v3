'use client'

import { useUserSettings, SupportedCurrency } from '@/lib/modules/user/settings/useUserSettings'
import { MAX_UINT256 } from '@balancer/sdk'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { useFxRates } from './useFxRates'

// Allows calling JSON.stringify with bigints
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}

export const MAX_BIGINT = BigInt(MAX_UINT256)

export const FIAT_FORMAT = '(0,00a)'

type Numberish = string | number | bigint | BigNumber

export function bn(val: Numberish): BigNumber {
  const number = val.toString()
  return new BigNumber(number)
}

function fiatFormat(val: Numberish): string {
  const number = val.toString()
  return numeral(number).format(FIAT_FORMAT)
}

function symbolForCurrency(currency: SupportedCurrency): string {
  switch (currency) {
    case SupportedCurrency.USD:
      return '$'
    case SupportedCurrency.EUR:
      return '€'
    case SupportedCurrency.GBP:
      return '£'
    case SupportedCurrency.JPY:
      return '¥'
    case SupportedCurrency.CNY:
      return '¥'
    default:
      return '$'
  }
}

export function useNumbers() {
  const { currency } = useUserSettings()
  const { getFxRate, hasFxRates } = useFxRates()

  function _toUserCurrency(val: Numberish): string {
    const amount = val.toString()
    const fxRate = getFxRate(currency)

    return bn(amount).times(fxRate).toString()
  }

  function toCurrency(val: Numberish): string {
    const amount = val.toString()
    const symbol = hasFxRates ? symbolForCurrency(currency) : '$'
    const convertedAmount = _toUserCurrency(amount)

    return symbol + fiatFormat(convertedAmount)
  }

  return { toCurrency }
}
