import { getRequiredTokenApprovals } from '@/lib/modules/tokens/approvals/approval-rules'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { ApproveTokenProps } from '@/lib/modules/tokens/approvals/useConstructApproveTokenStep'
import { useStaking } from './useStaking'

export interface ApproveTokenConfig {
  type: 'approveToken'
  props: ApproveTokenProps
}

/*
  Each ApproveTokenConfig contains the instructions to render an ApproveTokenButton
*/
export function useConstructApproveBptConfigs(): ApproveTokenConfig[] {
  const { userAddress } = useUserAccount()
  const { tokenAllowances, amountToApprove } = useStaking()
  const { chainId, chain } = useNetworkConfig()

  const tokenAmountsToApprove = getRequiredTokenApprovals({
    chainId,
    amountsToApprove: [amountToApprove],
    allowanceFor: tokenAllowances.allowanceFor,
  })

  return tokenAmountsToApprove.map(({ tokenAddress, rawAmount }) => {
    return {
      type: 'approveToken',
      props: {
        actionType: 'Staking',
        chain,
        amountToApprove: rawAmount,
        spenderAddress: userAddress,
        tokenAddress,
        tokenAllowances,
      },
    }
  })
}
