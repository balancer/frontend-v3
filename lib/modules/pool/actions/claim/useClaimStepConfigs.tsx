import { useHasApprovedRelayer } from '@/lib/modules/relayer/useHasApprovedRelayer'
import { useHasMinterApproval } from '@/lib/modules/staking/gauge/useHasMinterApproval'
import { getApproveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { minterApprovalConfig } from '@/lib/modules/staking/gauge/minterApprovalConfig'
import { ClaimAllRewardsButton } from '../../../portfolio/claim/ClaimAllRewardsButton'
import { Address } from 'viem'
import { GqlChain, GqlPoolStakingType } from '@/lib/shared/services/api/generated/graphql'
import { getChainId } from '@/lib/config/app.config'

export function useClaimStepConfigs(
  gaugeAddresses: Address[],
  chain: GqlChain,
  stakingType: GqlPoolStakingType
) {
  const { hasMinterApproval } = useHasMinterApproval()
  const { hasApprovedRelayer } = useHasApprovedRelayer(getChainId(chain))

  let stepConfigs = [
    {
      render: () => (
        <ClaimAllRewardsButton
          gaugeAddresses={gaugeAddresses}
          chain={chain}
          stakingType={stakingType}
        />
      ),
    },
  ]

  if (!hasApprovedRelayer) {
    const chainId = getChainId(chain)
    stepConfigs = [getApproveRelayerConfig(chainId), ...stepConfigs]
  }

  if (!hasMinterApproval) {
    stepConfigs = [minterApprovalConfig(chain), ...stepConfigs]
  }

  return stepConfigs
}
