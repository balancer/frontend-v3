/* eslint-disable react-hooks/exhaustive-deps */
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { UseTokenAllowancesResponse } from '@/lib/modules/web3/useTokenAllowances'
import { isEmpty } from 'lodash'
import { emptyAddress } from '../../web3/contracts/wagmi-helpers'
import { TokenAmountToApprove, getRequiredTokenApprovals } from './approval-rules'
import { useConstructApproveTokenStep } from './useConstructApproveTokenStep'
import { MAX_BIGINT } from '@/lib/shared/utils/numbers'
import { ApprovalAction } from './approval-labels'

type Params = {
  tokenAllowances: UseTokenAllowancesResponse
  amountsToApprove: TokenAmountToApprove[]
  actionType: ApprovalAction
  approveMaxBigInt?: boolean
}

const emptyAmountToApprove: TokenAmountToApprove = {
  tokenAddress: emptyAddress,
  rawAmount: MAX_BIGINT,
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

  const remainingAmountsToApprove = getRequiredTokenApprovals({
    chainId,
    amountsToApprove,
    currentTokenAllowances: allowances || {},
    approveMaxBigInt,
  })

  const tokenAmountToApprove = isEmpty(remainingAmountsToApprove)
    ? emptyAmountToApprove
    : remainingAmountsToApprove[0]

  const tokenApprovalStep = useConstructApproveTokenStep({
    tokenAllowances,
    tokenAmountToApprove,
    spenderAddress,
    actionType,
    chain,
  })

  return {
    tokenApprovalStep,
    isAllowancesLoading,
    remainingAmountsToApprove,
  }
}
