/* eslint-disable react-hooks/exhaustive-deps */
import { getChainId, getNativeAssetAddress } from '@/lib/config/app.config'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'
import { useMemo } from 'react'
import { Address } from 'viem'
import { ManagedErc20TransactionButton } from '../../transactions/transaction-steps/TransactionButton'
import { TransactionStep } from '../../transactions/transaction-steps/lib'
import { ManagedErc20TransactionInput } from '../../web3/contracts/useManagedErc20Transaction'
import { useTokenAllowances } from '../../web3/useTokenAllowances'
import { useUserAccount } from '../../web3/useUserAccount'
import { useTokens } from '../useTokens'
import { ApprovalAction, buildTokenApprovalLabels } from './approval-labels'
import { RawAmount, getRequiredTokenApprovals } from './approval-rules'

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
}: Params): { isLoading: boolean; steps: TransactionStep[] } {
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

  const steps = useMemo(() => {
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
        enabled: !!spenderAddress && !tokenAllowances.isAllowancesLoading,
        simulationMeta: sentryMetaForWagmiSimulation(
          'Error in wagmi tx simulation: Approving token',
          tokenAmountToApprove
        ),
      }

      return {
        id,
        stepType: 'tokenApproval',
        labels,
        isComplete,
        renderAction: () => <ManagedErc20TransactionButton key={id} id={id} {...props} />,
        //Testing purposes
        _props: props,
        onSuccess: () => tokenAllowances.refetchAllowances(),
      } as const satisfies TransactionStep
    })
  }, [tokenAllowances.allowances, userAddress])

  return {
    isLoading: tokenAllowances.isAllowancesLoading,
    steps,
  }
}
