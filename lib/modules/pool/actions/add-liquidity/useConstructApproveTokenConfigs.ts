import { getRequiredTokenApprovals } from '@/lib/modules/tokens/approvals/approval-rules'
import { ApproveTokenConfig } from '../useIterateSteps'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { useAddLiquidity } from './useAddLiquidity'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'

/*
  Each ApproveTokenConfig contains the instructions to render an ApproveTokenButton
*/
export function useConstructApproveTokenConfigs(): ApproveTokenConfig[] {
  const { userAddress } = useUserAccount()
  const { tokenAllowances, helpers, humanAmountsIn } = useAddLiquidity()
  const { chainId, chain } = useNetworkConfig()

  const tokenAmountsToApprove = getRequiredTokenApprovals({
    chainId,
    amountsToApprove: helpers.getAmountsToApprove(humanAmountsIn),
    allowanceFor: tokenAllowances.allowanceFor,
  })

  return tokenAmountsToApprove.map(({ tokenAddress, rawAmount }) => {
    return {
      type: 'approveToken',
      props: {
        actionType: 'AddLiquidity',
        chain,
        amountToApprove: rawAmount,
        spenderAddress: userAddress,
        tokenAddress,
        tokenAllowances,
      },
    }
  })
}
