import { getRequiredTokenApprovals } from '@/lib/modules/tokens/approvals/approval-rules'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { useAddLiquidity } from './useAddLiquidity'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { ApproveTokenProps } from '@/lib/modules/tokens/approvals/useConstructApproveTokenStep'

export interface ApproveTokenConfig {
  type: 'approveToken'
  props: ApproveTokenProps
}

/*
  Each ApproveTokenConfig contains the instructions to render an ApproveTokenButton
*/
export function useConstructApproveTokenConfigs(): ApproveTokenConfig[] {
  const { userAddress } = useUserAccount()
  const { tokenAllowances, inputAmounts } = useAddLiquidity()
  const { chainId, chain } = useNetworkConfig()

  const tokenAmountsToApprove = getRequiredTokenApprovals({
    chainId,
    rawAmounts: inputAmounts,
    allowanceFor: tokenAllowances.allowanceFor,
  })

  return tokenAmountsToApprove.map(tokenAmountToApprove => {
    return {
      type: 'approveToken',
      props: {
        tokenAllowances,
        tokenAmountToApprove,
        actionType: 'AddLiquidity',
        chain,
        spenderAddress: userAddress,
      },
    }
  })
}
