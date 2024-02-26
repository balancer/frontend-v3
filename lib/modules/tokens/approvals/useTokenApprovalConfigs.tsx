import { TransactionStepButton } from '@/lib/shared/components/btns/transaction-steps/TransactionStepButton'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Address } from 'viem'
import { CommonStepProps, OnStepCompleted, StepConfig } from '../../pool/actions/useIterateSteps'
import { usePool } from '../../pool/usePool'
import { useTokenAllowances } from '../../web3/useTokenAllowances'
import { useUserAccount } from '../../web3/useUserAccount'
import { useTokens } from '../useTokens'
import { ApprovalAction } from './approval-labels'
import { RawAmount, getRequiredTokenApprovals } from './approval-rules'
import { ApproveTokenProps, useConstructApproveTokenStep } from './useConstructApproveTokenStep'
import { getChainId } from '@/lib/config/app.config'

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

/*
  Generic hook to creates a Token Approval Step Config for different flows defined by the actionType property
*/
export function useTokenApprovalConfigs({
  spenderAddress,
  chain,
  approvalAmounts,
  actionType,
}: Params): StepConfig[] {
  const { userAddress } = useUserAccount()
  const { getToken } = useTokens()
  const { pool } = usePool()

  const _approvalAmounts = approvalAmounts.filter(amount => amount.rawAmount > 0)

  const approvalTokenAddresses = _approvalAmounts.map(amount => amount.address)

  const tokenAllowances = useTokenAllowances({
    chainId: getChainId(chain),
    userAddress,
    spenderAddress,
    tokenAddresses: approvalTokenAddresses,
  })

  const tokenAmountsToApprove = getRequiredTokenApprovals({
    chainId: chain,
    rawAmounts: _approvalAmounts,
    allowanceFor: tokenAllowances.allowanceFor,
  })

  return tokenAmountsToApprove.map(tokenAmountToApprove => {
    const token = getToken(tokenAmountToApprove.tokenAddress, chain)
    // if there is no token it must be a bpt, needs to be reconsidered if this assumption changes
    const symbol = (token && token?.symbol) ?? pool.symbol ?? 'Unknown'

    const props: ApproveTokenProps = {
      tokenAllowances,
      tokenAmountToApprove,
      actionType,
      spenderAddress,
      symbol,
    }
    return buildTokenApprovalConfig(props)
  })
}

function buildTokenApprovalConfig(props: ApproveTokenProps): StepConfig {
  const approvalStepConfig: StepConfig = {
    description: `Approve token ${props.symbol}`,
    render(useOnStepCompleted: OnStepCompleted) {
      return <ApproveTokenButton {...props} useOnStepCompleted={useOnStepCompleted} />
    },
  }
  return approvalStepConfig
}

export function ApproveTokenButton(props: Props) {
  const step = useConstructApproveTokenStep(props)

  props.useOnStepCompleted(step)

  return <TransactionStepButton step={step} />
}
