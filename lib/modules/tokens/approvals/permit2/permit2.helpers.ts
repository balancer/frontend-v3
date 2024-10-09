import { SdkQueryAddLiquidityOutput } from '@/lib/modules/pool/actions/add-liquidity/add-liquidity.types'
import { getNowTimestampInSecs } from '@/lib/shared/utils/time'
import { AllowedAmountsByTokenAddress, ExpirationByTokenAddress } from './usePermit2Allowance'
import { Address } from 'viem'
import { TokenAmount } from '@balancer/sdk'

export function hasValidPermit2(
  queryOutput?: SdkQueryAddLiquidityOutput,
  expirations?: ExpirationByTokenAddress,
  allowedAmounts?: AllowedAmountsByTokenAddress
): boolean {
  if (!expirations || !allowedAmounts) return false

  const approvalExpired = (tokenAddress: Address) =>
    expirations[tokenAddress] >= getNowTimestampInSecs()
  const alreadyAllowed = (amountIn: TokenAmount) =>
    !approvalExpired(amountIn.token.address) &&
    allowedAmounts[amountIn.token.address] >= amountIn.amount
  const amountInValid = (amountIn: TokenAmount) =>
    amountIn.amount === 0n || alreadyAllowed(amountIn)
  const isValid = !!queryOutput?.sdkQueryOutput.amountsIn.every(amountInValid)
  return isValid
}
