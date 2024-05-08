/* eslint-disable react-hooks/exhaustive-deps */
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
import { useMemo } from 'react'

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

  const _approvalAmounts = useMemo(
    () => approvalAmounts.filter(amount => !isSameAddress(amount.address, nativeAssetAddress)),
    [approvalAmounts]
  )

  const approvalTokenAddresses = useMemo(
    () => _approvalAmounts.map(amount => amount.address),
    [_approvalAmounts]
  )

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

  return useMemo(() => {
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
        onSuccess: () => tokenAllowances.refetchAllowances(),
      }
    })
  }, [tokenAllowances.allowances, userAddress])
}