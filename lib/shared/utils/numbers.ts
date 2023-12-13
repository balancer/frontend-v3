'use client'

import { MAX_UINT256, TokenAmount } from '@balancer/sdk'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { KeyboardEvent } from 'react'

// Allows calling JSON.stringify with bigints
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}

export const MAX_BIGINT = BigInt(MAX_UINT256)

export const INTEGER_FORMAT = '0,0'
export const FIAT_FORMAT_A = '0,0.00a'
export const FIAT_FORMAT = '0,0.00'
export const TOKEN_FORMAT_A = '0,0.[0000]a'
export const TOKEN_FORMAT = '0,0.[0000]'
export const APR_FORMAT = '0.[00]%'
export const FEE_FORMAT = '0.[0000]%'
export const WEIGHT_FORMAT = '(%0,0)'
export const PRICE_IMPACT_FORMAT = '0.00%'

// Do not display APR values greater than this amount; they are likely to be nonsensical
// These can arise from pools with extremely low balances (e.g., completed LBPs)
export const APR_UPPER_THRESHOLD = 1_000_000
export const APR_LOWER_THRESHOLD = 0.0000001

const NUMERAL_DECIMAL_LIMIT = 17

export type Numberish = string | number | bigint | BigNumber
export type NumberFormatter = (val: Numberish) => string

export function bn(val: Numberish): BigNumber {
  return new BigNumber(val.toString())
}

type FormatOpts = { abbreviated?: boolean }

/**
 * Converts a number to a string format within the decimal limit that numeral
 * can handle.
 */
function toSafeValue(val: Numberish): string {
  return bn(val).toFixed(NUMERAL_DECIMAL_LIMIT)
}

// Formats an integer value.
export function integerFormat(val: Numberish): string {
  return numeral(toSafeValue(val)).format(INTEGER_FORMAT)
}

// Formats a fiat value.
export function fiatFormat(val: Numberish, { abbreviated = true }: FormatOpts = {}): string {
  const format = abbreviated ? FIAT_FORMAT_A : FIAT_FORMAT
  return numeral(toSafeValue(val)).format(format)
}

// Formats a token value.
export function tokenFormat(val: Numberish, { abbreviated = true }: FormatOpts = {}): string {
  const format = abbreviated ? TOKEN_FORMAT_A : TOKEN_FORMAT
  return numeral(toSafeValue(val)).format(format)
}

// Formats an APR value as a percentage.
export function aprFormat(apr: Numberish): string {
  if (bn(apr).lt(APR_LOWER_THRESHOLD)) return '0%'
  if (bn(apr).gt(APR_UPPER_THRESHOLD)) return '-'

  return numeral(apr.toString()).format(APR_FORMAT)
}

// Formats a fee value as a percentage.
export function feePercentFormat(fee: Numberish): string {
  return numeral(fee.toString()).format(FEE_FORMAT)
}

// Formats a weight value as a percentage.
export function weightFormat(val: Numberish): string {
  return numeral(val.toString()).format(WEIGHT_FORMAT)
}

// Formats a price impact value as a percentage.
export function priceImpactFormat(val: Numberish): string {
  return numeral(val.toString()).format(PRICE_IMPACT_FORMAT)
}

// Sums an array of numbers safely using bignumber.js.
export function safeSum(amounts: Numberish[]): string {
  return amounts.reduce((a, b) => bn(a).plus(b.toString()), bn(0)).toString()
}

// Prevents invalid characters from being entered into a number input.
export function blockInvalidNumberInput(event: KeyboardEvent<HTMLInputElement>): void {
  ;['e', 'E', '+', '-'].includes(event.key) && event.preventDefault()
}
