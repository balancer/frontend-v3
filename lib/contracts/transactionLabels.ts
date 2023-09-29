import { TokenBase } from '../modules/tokens/token.types'
import { TransactionInfo } from './contract.types'

type TransactionLabels = {
  label: string
  loadingLabel: string
  confirmingLabel: string
  stepTooltip: string
}

type BuildTransactionLabels = (args?: any, transactionInfo?: TransactionInfo) => TransactionLabels

/**
 * Examples to illustrate a potential api based on functions to decouple label responsibility
 * These functions can then be passed when composing the whole set of steps for a given transaction flow
 */
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
