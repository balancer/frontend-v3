import { TransactionLabels } from '@/lib/shared/components/btns/transaction-steps/lib'
import { TokenBase } from '../../tokens/token.types'
import { TransactionBundle } from './contract.types'

export type BuildTransactionLabels = (
  args?: any,
  transactionBundle?: TransactionBundle
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
    init: `Approve ${args.normalizedAmount} for ${args.actionType}`,
    tooltip: `You must approve ${args.token.symbol} to ${args.actionType} this token.
    Approvals are required once per token, per wallet.`,
    description: '',
  }
}
