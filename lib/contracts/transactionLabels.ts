import { TokenBase } from '../modules/tokens/token.types'
import { TransactionInfo } from './contracts.types'

type TransactionLabels = {
  label: string
  loadingLabel: string
  confirmingLabel: string
  stepTooltip: string
}

type BuildTransactionLabels = (args?: any, transactionInfo?: TransactionInfo) => TransactionLabels

export const buildRelayerApprovalLabels: BuildTransactionLabels = () => {
  return {
    label: 'Sign relayer approval',
    loadingLabel: 'Confirm in wallet',
    confirmingLabel: 'Signing relayer approval',
    stepTooltip: 'Your signature is required to use the relayer.',
  }
}

enum ApprovalAction {
  AddLiquidity,
  Staking,
  Unapprove,
  Unwrapping,
}

interface ApproveTokenParams {
  token: TokenBase
  normalizedAmount: string
  spender: string //Gauge Address
  actionType: ApprovalAction
}
export const buildTokenApprovalLabels: BuildTransactionLabels = (args: ApproveTokenParams) => {
  return {
    label: `Approve ${args.normalizedAmount} for ${args.actionType}`,
    loadingLabel: 'Confirm approval in wallet',
    confirmingLabel: 'Confirming',
    stepTooltip: `You must approve ${args.token.symbol} to ${args.actionType} this token.
    Approvals are required once per token, per wallet.`,
  }
}
