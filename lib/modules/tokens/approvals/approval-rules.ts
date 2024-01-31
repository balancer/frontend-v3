import { SupportedChainId } from '@/lib/config/config.types'
import { isNativeAsset } from '@/lib/shared/utils/addresses'
import { Address } from 'viem'
import { requiresDoubleApproval } from '@/lib/config/tokens.config'
import { MAX_BIGINT } from '@/lib/shared/utils/numbers'

export type TokenAmountToApprove = {
  rawAmount: bigint
  tokenAddress: Address
}

type TokenApprovalParams = {
  chainId: SupportedChainId | null
  amountsToApprove: TokenAmountToApprove[]
  allowanceFor: (tokenAddress: Address) => bigint
  approveMaxBigInt?: boolean
  skipAllowanceCheck?: boolean
}

/*
  Filters the given list of amountsToApprove discarding those that do not need approval
*/
export function getRequiredTokenApprovals({
  chainId,
  amountsToApprove,
  allowanceFor,
  approveMaxBigInt = true,
  skipAllowanceCheck = false,
}: TokenApprovalParams) {
  if (!chainId) return []
  if (skipAllowanceCheck) return []

  let tokenAmountsToApprove = amountsToApprove.filter(({ tokenAddress, rawAmount }) => {
    if (isNativeAsset(chainId, tokenAddress)) return false

    const hasEnoughAllowedAmount = allowanceFor(tokenAddress) >= rawAmount
    if (hasEnoughAllowedAmount) return false
    return true
  })

  if (approveMaxBigInt) {
    // Use MAX_BIGINT in all the amounts to approve
    tokenAmountsToApprove = tokenAmountsToApprove.map(({ tokenAddress }) => {
      return { tokenAddress, rawAmount: MAX_BIGINT }
    })
  }

  tokenAmountsToApprove = approveMaxBigInt
    ? tokenAmountsToApprove.map(amountToApprove => ({
        ...amountToApprove,
        rawAmount: MAX_BIGINT,
      }))
    : tokenAmountsToApprove

  /**
   * Some tokens (e.g. USDT) require setting their approval amount to 0n before being
   * able to adjust the value up again (only when there was an existing allowance)
   */
  return tokenAmountsToApprove.flatMap(t => {
    if (isDoubleApprovalRequired(chainId, t.tokenAddress, allowanceFor)) {
      const zeroTokenAmountToApprove: TokenAmountToApprove = {
        rawAmount: 0n,
        tokenAddress: t.tokenAddress,
      }
      // Prepend approval for ZERO amount
      return [zeroTokenAmountToApprove, t]
    }
    return t
  })
}

/**
 * Some tokens require setting their approval amount to 0 first before being
 * able to adjust the value up again. This returns true for tokens that requires
 * this and false otherwise.
 */
export function isDoubleApprovalRequired(
  chainId: SupportedChainId,
  tokenAddress: Address,
  allowanceFor: (tokenAddress: Address) => bigint
): boolean {
  return !!(requiresDoubleApproval(chainId, tokenAddress) && allowanceFor(tokenAddress) > 0n)
}
