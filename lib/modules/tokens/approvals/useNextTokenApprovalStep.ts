/* eslint-disable react-hooks/exhaustive-deps */
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { useTokenAllowances } from '@/lib/modules/web3/useTokenAllowances'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { emptyAddress } from '../../web3/contracts/wagmi-helpers'
import { TokenAmountToApprove, filterRequiredTokenApprovals } from './approval-rules'
import { useCompletedApprovalsState } from './useCompletedApprovalsState'
import { useConstructApproveTokenStep } from './useConstructApproveTokenStep'
import { MAX_BIGINT } from '@/lib/shared/utils/numbers'

/*
  Returns the next Token Approval Step to be rendered by the TransactionFlow component
  When the current approval is completed it will refetch allowances and then return the next Approval Step
  filterRequiredTokenApprovals is recalculated after updating the allowances so we can always return the first in the list until the list in empty
*/
export function useNextTokenApprovalStep(amountsToApprove: TokenAmountToApprove[]) {
  const { chainId, chain } = useNetworkConfig()
  // IDEA: maybe we can have a concrete vault token provider with a more specific useVaultAllowance method??
  const vaultAllowances = useTokenAllowances()
  const currentTokenAllowances = vaultAllowances.allowances || {}
  const [initialAmountsToApprove, setInitialAmountsToApprove] = useState<
    TokenAmountToApprove[] | null
  >(null)

  const filteredAmountsToApprove = filterRequiredTokenApprovals({
    chainId,
    amountsToApprove,
    currentTokenAllowances,
  })

  useEffect(() => {
    // Saves the first value of filteredAmountsToApprove to render the list of approval steps in the UI
    if (initialAmountsToApprove === null) setInitialAmountsToApprove(filteredAmountsToApprove)
  }, [filteredAmountsToApprove])

  const completedTokenApprovalsState = useCompletedApprovalsState()

  const tokenAddressToApprove = isEmpty(filteredAmountsToApprove)
    ? emptyAddress
    : filteredAmountsToApprove[0].tokenAddress

  const tokenApprovalStep = useConstructApproveTokenStep({
    tokenAddress: tokenAddressToApprove,
    spender: 'balancer.vaultV2',
    actionType: 'AddLiquidity',
    chain,
    amountToApprove: MAX_BIGINT, //TODO: Use amounts to approve
    completedApprovalState: completedTokenApprovalsState,
  })

  return {
    initialAmountsToApprove,
    tokenApprovalStep,
    isAllowancesLoading: vaultAllowances.isAllowancesLoading,
  }
}
