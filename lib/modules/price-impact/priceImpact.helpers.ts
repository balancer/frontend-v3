/*
 ABA priceImpact calculation has some known limitations. Examples:
 - You can’t calculate it for add liquidity amounts that are higher than the pool balance (it will return a BAL#001 error)
 - Add Liquidity Unbalanced uses a querySwap and Weighted pools have a limit that you can’t swap > 30% of the token balance in the pool
 for add liquidity amounts that are higher than the pool balance (it will return a BAL#304 error)

 For now, if we receive a ContractFunctionExecutionError we will assume that it is an ABA limitation and we will show an "unknown price impact" warning to the user.

 Note that the SDK error could change, so we should keep an eye on it.
 */
export function isUnhandledAddPriceImpactError(error: Error | null): boolean {
  if (!error) return false
  if (cannotCalculatePriceImpactError(error)) return false
  return true
}

export function cannotCalculatePriceImpactError(error: Error | null): boolean {
  if (error && error.name === 'ContractFunctionExecutionError') {
    return true
  }
  return false
}
