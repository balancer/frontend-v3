import { useHasApprovedRelayer } from '@/lib/modules/relayer/useHasApprovedRelayer'
import { useHasMinterApproval } from '@/lib/modules/staking/gauge/useHasMinterApproval'
import { minterApprovalConfig } from '@/lib/modules/staking/gauge/minterApprovalConfig'
import { ClaimAllRewardsButton } from '../../../portfolio/PortfolioClaim/ClaimButtons/ClaimAllRewardsButton'
import { getApproveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { getChainId } from '@/lib/config/app.config'
import { PoolListItem } from '../../pool.types'
import { StepConfig } from '../../../transactions/transaction-steps/useIterateSteps'

export function useClaimStepConfigs(pools: PoolListItem[]): StepConfig[] {
  const { chain } = pools[0]
  const chainId = getChainId(chain)
  const { hasMinterApproval } = useHasMinterApproval()
  const { hasApprovedRelayer } = useHasApprovedRelayer(chainId)

  let stepConfigs: StepConfig[] = [
    {
      title: 'Claim',
      render: () => <ClaimAllRewardsButton pools={pools} />,
    },
  ]

  if (!hasApprovedRelayer) {
    stepConfigs = [getApproveRelayerConfig(chainId), ...stepConfigs]
  }

  if (!hasMinterApproval) {
    stepConfigs = [minterApprovalConfig(chain), ...stepConfigs]
  }

  return stepConfigs
}
