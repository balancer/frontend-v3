'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { MAX_UINT256 } from '@balancer/sdk'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { useFxRates } from './useFxRates'
import { symbolForCurrency } from '../utils/currencies'

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

export function useNumbers() {
  const { currency } = useUserSettings()
  const { getFxRate, hasFxRates } = useFxRates()

  function toUserCurrency(val: Numberish): string {
    const amount = val.toString()
    const fxRate = getFxRate(currency)

    return bn(amount).times(fxRate).toString()
  }

  function toCurrency(val: Numberish): string {
    const amount = val.toString()
    const symbol = hasFxRates ? symbolForCurrency(currency) : '$'
    const convertedAmount = toUserCurrency(amount)

    return symbol + fiatFormat(convertedAmount)
  }

  return { toCurrency }
}
