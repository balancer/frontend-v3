import { FetchBalanceResult } from 'wagmi/actions'

export function prettyPrintBalance(balance?: FetchBalanceResult) {
  return !balance ? '-' : `${balance.formatted} ${balance.symbol}`
}
