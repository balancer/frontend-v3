import { TransactionLabels } from '@/components/btns/transaction-steps/lib'
import { TokenBase } from '../modules/tokens/token.types'
import { TransactionInfo } from './contract.types'

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
    ready: `Approve ${args.normalizedAmount} for ${args.actionType}`,
    tooltip: `You must approve ${args.token.symbol} to ${args.actionType} this token.
    Approvals are required once per token, per wallet.`,
    description: 'bing',
  }
}
