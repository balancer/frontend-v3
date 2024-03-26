import { TransactionStepButton } from '@/lib/modules/transactions/transaction-steps/TransactionStepButton'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Address } from 'viem'
import {
  CommonStepProps,
  OnStepCompleted,
  StepConfig,
} from '../../transactions/transaction-steps/useIterateSteps'
import { useTokenAllowances } from '../../web3/useTokenAllowances'
import { useUserAccount } from '../../web3/useUserAccount'
import { useTokens } from '../useTokens'
import { ApprovalAction } from './approval-labels'
import { RawAmount, getRequiredTokenApprovals } from './approval-rules'
import { ApproveTokenProps, useConstructApproveTokenStep } from './useConstructApproveTokenStep'
import { getChainId, getNativeAssetAddress } from '@/lib/config/app.config'
import { isSameAddress } from '@/lib/shared/utils/addresses'

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
  bptSymbol?: string //Edge-case for approving
}

/*
  Generic hook to creates a Token Approval Step Config for different flows defined by the actionType property
*/
export function useTokenApprovalConfigs({
  spenderAddress,
  chain,
  approvalAmounts,
  actionType,
  bptSymbol,
}: Params): StepConfig[] {
  const { userAddress } = useUserAccount()
  const { getToken } = useTokens()
  const nativeAssetAddress = getNativeAssetAddress(chain)

  const _approvalAmounts = approvalAmounts
    .filter(amount => amount.rawAmount > 0)
    .filter(amount => !isSameAddress(amount.address, nativeAssetAddress))

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
    const symbol = bptSymbol ?? (token && token?.symbol) ?? 'Unknown'

    const props: ApproveTokenProps = {
      tokenAllowances,
      tokenAmountToApprove,
      actionType,
      chain,
      symbol,
      spenderAddress,
    }
    return buildTokenApprovalConfig(props)
  })
}

function buildTokenApprovalConfig(props: ApproveTokenProps): StepConfig {
  const approvalStepConfig: StepConfig = {
    title: `Approve ${props.symbol}`,
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
