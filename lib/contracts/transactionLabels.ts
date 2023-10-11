import { TokenBase } from '../modules/tokens/token.types'
import { TransactionInfo } from './contract.types'

type TransactionLabels = {
  label: string
  loadingLabel: string
  confirmingLabel: string
  stepTooltip: string
}

export type BuildTransactionLabels = (
  args?: any,
  transactionInfo?: TransactionInfo
) => TransactionLabels

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

/**
 * In this example the labels depend on the context (ApproveTokenParams)
 */
export const buildTokenApprovalLabels: BuildTransactionLabels = (args: ApproveTokenParams) => {
  return {
    label: `Approve ${args.normalizedAmount} for ${args.actionType}`,
    loadingLabel: 'Confirm approval in wallet',
    confirmingLabel: 'Confirming',
    stepTooltip: `You must approve ${args.token.symbol} to ${args.actionType} this token.
    Approvals are required once per token, per wallet.`,
  }
}
