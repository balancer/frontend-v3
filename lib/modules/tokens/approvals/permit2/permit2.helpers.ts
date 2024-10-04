import { SdkQueryAddLiquidityOutput } from '@/lib/modules/pool/actions/add-liquidity/add-liquidity.types'
import { getNowTimestampInSecs } from '@/lib/shared/utils/time'
import { AllowedAmountsByTokenAddress, ExpirationByTokenAddress } from './usePermit2Allowance'

export function hasValidPermit2(
  queryOutput?: SdkQueryAddLiquidityOutput,
  expirations?: ExpirationByTokenAddress,
  allowedAmounts?: AllowedAmountsByTokenAddress
): boolean {
  if (!expirations || !allowedAmounts) return false
  const isValid = !!queryOutput?.sdkQueryOutput.amountsIn.every(
    t =>
      t.amount === 0n ||
      (expirations[t.token.address] >= getNowTimestampInSecs() &&
        allowedAmounts[t.token.address] >= t.amount)
  )
  return isValid
}
