import { SupportedChainId } from '@/lib/config/config.types'
import { isNativeAsset } from '@/lib/shared/utils/addresses'
import { Address } from 'viem'
import { TokenAllowances } from '../../web3/useTokenAllowances'

export type TokenAmountToApprove = {
  rawAmount: bigint
  tokenAddress: Address
}

type TokenApprovalParams = {
  chainId: SupportedChainId | null
  amountsToApprove: TokenAmountToApprove[]
  currentTokenAllowances: TokenAllowances
  skipAllowanceCheck?: boolean
}

/*
  Filters the given list of amountsToApprove discarding those that do not need approval
*/
export function getRequiredTokenApprovals({
  chainId,
  amountsToApprove,
  currentTokenAllowances,
  skipAllowanceCheck = false,
}: TokenApprovalParams) {
  if (!chainId) return []
  if (skipAllowanceCheck) return []

  return amountsToApprove.filter(({ tokenAddress, rawAmount }) => {
    if (isNativeAsset(chainId, tokenAddress)) return false
    const allowedAmount = currentTokenAllowances[tokenAddress]

    const hasEnoughAllowedAmount = allowedAmount >= rawAmount
    if (hasEnoughAllowedAmount) return false
    return true
  })
}
