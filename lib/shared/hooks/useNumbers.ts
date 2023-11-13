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

export const FIAT_FORMAT = '0[.][00]a'
export const TOKEN_FORMAT = '0[.][00]a'
export const APR_FORMAT = '0.[00]%'
export const FEE_FORMAT = '0.[0000]%'
export const WEIGHT_FORMAT = '(%0,0)'

// Do not display APR values greater than this amount; they are likely to be nonsensical
// These can arise from pools with extremely low balances (e.g., completed LBPs)
export const APR_UPPER_THRESHOLD = 1_000_000
export const APR_LOWER_THRESHOLD = 0.0000001

type Numberish = string | number | bigint | BigNumber
export type NumberFormatter = (val: Numberish) => string

export function bn(val: Numberish): BigNumber {
  const number = val.toString()
  return new BigNumber(number)
}

function fiatFormat(val: Numberish): string {
  const number = bn(val).toPrecision(6)
  return numeral(number).format(FIAT_FORMAT)
}

export function aprFormat(apr: Numberish): string {
  if (bn(apr).lt(APR_LOWER_THRESHOLD)) return '0%'
  if (bn(apr).gt(APR_UPPER_THRESHOLD)) return '-'

  return numeral(apr.toString()).format(APR_FORMAT)
}

export function feePercentFormat(fee: Numberish): string {
  return numeral(fee.toString()).format(FEE_FORMAT)
}

export function tokenFormat(val: Numberish): string {
  const number = bn(val).toPrecision(6)
  return numeral(number).format(TOKEN_FORMAT)
}

export function weightFormat(val: Numberish): string {
  return numeral(val.toString()).format(WEIGHT_FORMAT)
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
