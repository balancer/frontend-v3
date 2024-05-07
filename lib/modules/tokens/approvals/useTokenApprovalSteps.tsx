import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Address } from 'viem'
import { useTokenAllowances } from '../../web3/useTokenAllowances'
import { useUserAccount } from '../../web3/useUserAccount'
import { useTokens } from '../useTokens'
import { ApprovalAction, buildTokenApprovalLabels } from './approval-labels'
import { RawAmount, getRequiredTokenApprovals } from './approval-rules'
import { ApproveTokenProps } from './useConstructApproveTokenStep'
import { getChainId, getNativeAssetAddress } from '@/lib/config/app.config'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { TransactionStep2 } from '../../transactions/transaction-steps/lib'
import { ManagedErc20TransactionButton } from '../../transactions/transaction-steps/TransactionButton'
import { ManagedErc20TransactionInput } from '../../web3/contracts/useManagedErc20Transaction'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'
import { useEffect } from 'react'
import { useTransactionSteps } from '../../transactions/transaction-steps/TransactionStepsProvider'

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
export function useTokenApprovalSteps({
  spenderAddress,
  chain,
  approvalAmounts,
  actionType,
  bptSymbol,
}: Params): TransactionStep2[] {
  const { userAddress } = useUserAccount()
  const { getToken } = useTokens()
  const nativeAssetAddress = getNativeAssetAddress(chain)
  const { getTransaction } = useTransactionSteps()

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

  useEffect(() => {
    // refetch allowances after the approval transaction was executed
    async function saveExecutedApproval() {
      if (approvalTransaction.result.isSuccess) {
        await refetchAllowances()
        setDidRefetchAllowances(true)
      }
    }
    saveExecutedApproval()
  }, [approvalTransaction.result.isSuccess])

  return tokenAmountsToApprove.map(tokenAmountToApprove => {
    const { tokenAddress, requestedRawAmount } = tokenAmountToApprove
    const token = getToken(tokenAddress, chain)
    const symbol = bptSymbol ?? (token && token?.symbol) ?? 'Unknown'
    const labels = buildTokenApprovalLabels({ actionType, symbol })
    const id = tokenAddress

    const isComplete = () => tokenAllowances.allowanceFor(tokenAddress) >= requestedRawAmount

    const props: ManagedErc20TransactionInput = {
      tokenAddress,
      functionName: 'approve',
      labels,
      chainId: getChainId(chain),
      args: [spenderAddress, requestedRawAmount],
      additionalConfig: {
        query: {
          enabled: !!spenderAddress && !tokenAllowances.isAllowancesLoading,
          meta: sentryMetaForWagmiSimulation(
            'Error in wagmi tx simulation: Approving token',
            tokenAmountToApprove
          ),
        },
      },
    }

    return {
      id,
      stepType: 'tokenApproval',
      labels,
      isComplete,
      renderAction: () => <ManagedErc20TransactionButton id={id} {...props} />,
    }
  })
}
