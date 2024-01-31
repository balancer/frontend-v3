import { SupportedChainId } from '@/lib/config/config.types'
import { requiresDoubleApproval } from '@/lib/config/tokens.config'
import { isNativeAsset } from '@/lib/shared/utils/addresses'
import { Address } from 'viem'
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

  const requiredAmountsToApprove = amountsToApprove.filter(({ tokenAddress, rawAmount }) => {
    if (isNativeAsset(chainId, tokenAddress)) return false

    const hasEnoughAllowedAmount = allowanceFor(tokenAddress) >= rawAmount
    if (hasEnoughAllowedAmount) return false
    return true
  })

  return approveMaxBigInt
    ? requiredAmountsToApprove.map(amountToApprove => ({
        ...amountToApprove,
        rawAmount: MAX_BIGINT,
      }))
    : requiredAmountsToApprove
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
