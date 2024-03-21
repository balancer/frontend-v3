import { BuildTransactionLabels } from '../../web3/contracts/transactionLabels'

export type ApprovalAction =
  | 'AddLiquidity'
  | 'Locking'
  | 'Staking'
  | 'Swapping'
  | 'Unapprove'
  | 'Unwrapping'

export type TokenApprovalLabelArgs = {
  actionType: ApprovalAction
  symbol: string
}
export const buildTokenApprovalLabels: BuildTransactionLabels = (args: TokenApprovalLabelArgs) => {
  return {
    init: initApprovalLabelFor(args.actionType, args.symbol),
    confirming:
      args.actionType === 'Unapprove' ? `Unapproving ${args.symbol}` : `Approving ${args.symbol}`,
    tooltip: tooltipApprovalLabelFor(args.actionType, args.symbol),
  }
}

function initApprovalLabelFor(actionType: ApprovalAction, symbol: string) {
  switch (actionType) {
    case 'Locking':
      return `Approve ${symbol} for locking`
    case 'Staking':
      return `Approve ${symbol} for staking`
    case 'Swapping':
      return `Approve ${symbol} for swapping`
    case 'Unapprove':
      return `Unapprove ${symbol}`
    case 'Unwrapping':
      return `Approve ${symbol} for unwrapping`
    default:
      return `Approve ${symbol} for adding liquidity`
  }
}

function tooltipApprovalLabelFor(actionType: ApprovalAction, symbol: string) {
  switch (actionType) {
    case 'Locking':
      return `You must approve ${symbol} to lock this token. Approvals are required once per token, per wallet.`
    case 'Staking':
      return `You must approve ${symbol} to stake this token. Approvals are required once per token, per wallet.`
    case 'Swapping':
      return `You must approve ${symbol} to swap this token. Approvals are required once per token, per wallet.`
    case 'Unapprove':
      return `You must unapprove ${symbol} before a new approval value can be set.`
    case 'Unwrapping':
      return `You must approve ${symbol} to unwrap this token. Approvals are required once per token, per wallet.`
    default:
      return `You must approve ${symbol} to add liquidity for this token on Balancer.
Approvals are required once per token, per wallet.`
  }
}
