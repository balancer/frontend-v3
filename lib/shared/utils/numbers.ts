// 'use strict'

import { MAX_UINT256 } from '@balancer/sdk'
import BigNumber from 'bignumber.js'

// Allows calling JSON.stringify with bigints
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}

export const MAX_BIGINT = BigInt(MAX_UINT256)

export const FIAT_FORMAT = '($0,00a)'

export function bn(val: string | number | BigInt): BigNumber {
  const number = typeof val === 'string' ? val : val ? val.toString() : '0'
  return new BigNumber(number)
}
