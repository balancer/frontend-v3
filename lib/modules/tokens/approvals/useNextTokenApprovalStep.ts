import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { useTokenAllowances } from '@/lib/modules/web3/useTokenAllowances'
import { isEmpty } from 'lodash'
import { useConstructApproveTokenStep } from '../../pool/add-liquidity/useConstructApproveTokenStep'
import { emptyAddress } from '../../web3/contracts/wagmi-helpers'
import { AmountToApprove, filterRequiredTokenApprovals } from './approval-rules'
import { useCompletedApprovalsState } from './useCompletedApprovalsState'

/*
  Returns the next Token Approval Step to be rendered by the TransactionFlow component
  When the current approval is completed it will refetch allowances and then return the next Approval Step
  filterRequiredTokenApprovals is recalculated after updating the allowances so we can always return the first in the list until the list in empty
*/
export function useNextTokenApprovalStep(amountsToApprove: AmountToApprove[]) {
  const { chainId } = useNetworkConfig()
  // IDEA: maybe we can have a concrete vault token provider with a more specific useVaultAllowance method??
  const vaultAllowances = useTokenAllowances()
  const currentTokenAllowances = vaultAllowances.allowances || {}

  const filteredAmountsToApprove = filterRequiredTokenApprovals({
    chainId,
    amountsToApprove,
    currentTokenAllowances,
  })

  const completedTokenApprovalsState = useCompletedApprovalsState()

  const tokenAddressToApprove = isEmpty(filteredAmountsToApprove)
    ? emptyAddress
    : filteredAmountsToApprove[0].tokenAddress

  const tokenApprovalStep = useConstructApproveTokenStep(
    tokenAddressToApprove,
    completedTokenApprovalsState
  )

  return {
    tokenApprovalStep,
    isAllowancesLoading: vaultAllowances.isAllowancesLoading,
  }
}
