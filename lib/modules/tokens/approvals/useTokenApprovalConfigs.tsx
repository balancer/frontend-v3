import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Address } from 'viem'
import { CommonStepProps, OnStepCompleted, StepConfig } from '../../pool/actions/useIterateSteps'
import { useTokenAllowances } from '../../web3/useTokenAllowances'
import { useUserAccount } from '../../web3/useUserAccount'
import { ApprovalAction } from './approval-labels'
import { RawAmount, getRequiredTokenApprovals } from './approval-rules'
import { ApproveTokenProps, useConstructApproveTokenStep } from './useConstructApproveTokenStep'
import { TransactionStepButton } from '@/lib/shared/components/btns/transaction-steps/TransactionStepButton'

type Props = ApproveTokenProps & CommonStepProps

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
}: Params): StepConfig[] {
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
    return TokenApprovalConfig(props)
  })
}

function TokenApprovalConfig(props: ApproveTokenProps): StepConfig {
  const approvalStepConfig: StepConfig = {
    Render(useOnStepCompleted: OnStepCompleted) {
      return (
        <ApproveTokenButton {...props} useOnStepCompleted={useOnStepCompleted}></ApproveTokenButton>
      )
    },
  }
  return approvalStepConfig
}

/*
  We need this component to avoid returning useConstructApproveTokenStep in a loop when building multiple ApproveToken steps
  Rules of react hooks: https://react.dev/warnings/invalid-hook-call-warning#breaking-rules-of-hooks
*/
export function ApproveTokenButton(props: Props) {
  const step = useConstructApproveTokenStep(props)

  props.useOnStepCompleted(step)

  return <TransactionStepButton step={step}></TransactionStepButton>
}
