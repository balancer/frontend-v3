import { SupportedChainId } from '@/lib/config/config.types'
import { isNativeAsset } from '@/lib/shared/utils/addresses'
import { Address } from 'viem'
import { TokenAllowances } from '../../web3/useTokenAllowances'
import { requiresDoubleApproval } from '@/lib/config/tokens.config'

export type AmountToApprove = {
  tokenAddress: Address
  amount: bigint //TODO: depending on the consumer this could be a HumanAmount type
}

type TokenApprovalParams = {
  chainId: SupportedChainId | null
  amountsToApprove: AmountToApprove[]
  currentTokenAllowances: TokenAllowances
  // spenderAddress: Address // Check comment below
  skipAllowanceCheck?: boolean
}

/*
  Filters the given list of amountsToApprove discarding those that do not need approval
*/
export function filterRequiredTokenApprovals({
  chainId,
  amountsToApprove,
  currentTokenAllowances,
  // TODO: in V2 we were passing the spender to a similar function but maybe we don't need it here
  // as we can leave it in higher abstraction layers
  // spenderAddress,
  skipAllowanceCheck = false,
}: TokenApprovalParams) {
  if (!chainId) return []
  if (skipAllowanceCheck) return []

  return amountsToApprove.filter(({ tokenAddress, amount }) => {
    if (isNativeAsset(chainId, tokenAddress)) return false
    const allowedAmount = currentTokenAllowances[tokenAddress]

    // We were checking this in V2 but maybe we don't need it if we only generate valid amounts to approve
    // const amountToApproveIsInvalid = amount == 0n
    // if (amountToApproveIsInvalid) return false

    const hasEnoughAllowedAmount = allowedAmount >= amount
    if (hasEnoughAllowedAmount) return false
    return true
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
  currentTokenAllowances: TokenAllowances
): boolean {
  return !!(
    requiresDoubleApproval(chainId, tokenAddress) && currentTokenAllowances[tokenAddress] > 0n
  )
}
