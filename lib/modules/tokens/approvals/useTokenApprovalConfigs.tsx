import { Address } from 'viem'
import { useTokenAllowances } from '../../web3/useTokenAllowances'
import { useUserAccount } from '../../web3/useUserAccount'
import { RawAmount, getRequiredTokenApprovals } from './approval-rules'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { ApproveTokenProps } from './useConstructApproveTokenStep'
import { ApprovalAction } from './approval-labels'
import { ApproveTokenButton } from './ApproveTokenButton'
import { OnStepCompleted } from '../../pool/actions/useIterateSteps'

export interface ApproveTokenConfig {
  type: 'approveToken'
  props: ApproveTokenProps
}

export type Params = {
  spenderAddress: Address
  chain: GqlChain
  approvalAmounts: RawAmount[]
  actionType: ApprovalAction
}

export function useTokenApprovalConfigs({
  spenderAddress,
  chain,
  approvalAmounts,
  actionType,
}: Params) {
  const { userAddress } = useUserAccount()

  const _approvalAmounts = approvalAmounts.filter(amount => amount.rawAmount > 0)

  const approvalTokenAddresses = _approvalAmounts.map(amount => amount.address)

  const tokenAllowances = useTokenAllowances(userAddress, spenderAddress, approvalTokenAddresses)

  const tokenAmountsToApprove = getRequiredTokenApprovals({
    chainId: chain,
    rawAmounts: _approvalAmounts,
    allowanceFor: tokenAllowances.allowanceFor,
  })

  return tokenAmountsToApprove.map(tokenAmountToApprove => {
    const props: ApproveTokenProps = {
      tokenAllowances,
      tokenAmountToApprove,
      actionType,
      chain,
      spenderAddress,
    }

    return {
      type: 'approveToken',
      render(useOnStepCompleted: OnStepCompleted) {
        return (
          <ApproveTokenButton
            {...props}
            useOnStepCompleted={useOnStepCompleted}
          ></ApproveTokenButton>
        )
      },
    }
  })
}
