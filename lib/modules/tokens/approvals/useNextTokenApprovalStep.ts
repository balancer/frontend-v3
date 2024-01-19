/* eslint-disable react-hooks/exhaustive-deps */
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { UseTokenAllowancesResponse } from '@/lib/modules/web3/useTokenAllowances'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { emptyAddress } from '../../web3/contracts/wagmi-helpers'
import { TokenAmountToApprove, getRequiredTokenApprovals } from './approval-rules'
import { useCompletedApprovalsState } from './useCompletedApprovalsState'
import { useConstructApproveTokenStep } from './useConstructApproveTokenStep'
import { MAX_BIGINT } from '@/lib/shared/utils/numbers'
import { ApprovalAction } from './approval-labels'

type Params = {
  tokenAllowances: UseTokenAllowancesResponse
  amountsToApprove: TokenAmountToApprove[]
  actionType: ApprovalAction
  approveMaxBigInt?: boolean
}

/*
  Returns the next Token Approval Step to be rendered by the TransactionFlow component
  When the current approval is completed it will refetch allowances and then return the next Approval Step
  getRequiredTokenApprovals is recalculated after updating the allowances so we can always return the first in the list until the list in empty
*/
export function useNextTokenApprovalStep({
  tokenAllowances,
  amountsToApprove,
  actionType,
  approveMaxBigInt = true,
}: Params) {
  const { chainId, chain } = useNetworkConfig()

  const { allowances, isAllowancesLoading, spenderAddress } = tokenAllowances

  const currentTokenAllowances = allowances || {}
  const [initialAmountsToApprove, setInitialAmountsToApprove] = useState<
    TokenAmountToApprove[] | null
  >(null)

  const remainingAmountsToApprove = getRequiredTokenApprovals({
    chainId,
    amountsToApprove,
    currentTokenAllowances,
  })

  useEffect(() => {
    // Saves the first value of filteredAmountsToApprove to render the list of approval steps in the UI
    if (initialAmountsToApprove === null) setInitialAmountsToApprove(remainingAmountsToApprove)
  }, [remainingAmountsToApprove])

  const completedTokenApprovalsState = useCompletedApprovalsState()

  const tokenAddressToApprove = isEmpty(remainingAmountsToApprove)
    ? emptyAddress
    : remainingAmountsToApprove[0].tokenAddress

  const amountToApprove =
    isEmpty(remainingAmountsToApprove) || approveMaxBigInt
      ? MAX_BIGINT
      : remainingAmountsToApprove[0].rawAmount

  const tokenApprovalStep = useConstructApproveTokenStep({
    tokenAllowances,
    tokenAddress: tokenAddressToApprove,
    spenderAddress,
    actionType,
    chain,
    amountToApprove,
    completedApprovalState: completedTokenApprovalsState,
  })

  return {
    initialAmountsToApprove,
    tokenApprovalStep,
    isAllowancesLoading,
  }
}
