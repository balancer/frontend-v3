import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { useTokenAllowances } from '@/lib/modules/web3/useTokenAllowances'
import { useConstructApproveTokenStep } from '../../steps/useConstructApproveTokenStep'
import { AmountToApprove, filterRequiredTokenApprovals } from './approvals'

export function useConstructTokenApprovals(amountsToApprove: AmountToApprove[]) {
  const { chainId } = useNetworkConfig()
  // IDEA: maybe we can have a concrete vault token provider with a more specific useVaultAllowance method??
  const vaultAllowances = useTokenAllowances()
  const currentTokenAllowances = vaultAllowances.allowances || {}

  const filteredAmountsToApprove = filterRequiredTokenApprovals({
    chainId,
    amountsToApprove,
    currentTokenAllowances,
  })

  const tokenApprovalSteps = amountsToApprove.map(({ tokenAddress, amount }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useConstructApproveTokenStep(tokenAddress, amount)
  })

  return {
    tokenApprovalSteps,
    isAllowancesLoading: vaultAllowances.isAllowancesLoading,
    filteredAmountsToApprove,
  }
}
