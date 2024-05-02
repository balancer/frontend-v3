import { ProjectConfig } from '@/lib/config/config.types'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

export const balancerSupportedNetworks = [
  GqlChain.Mainnet,
  GqlChain.Arbitrum,
  GqlChain.Avalanche,
  GqlChain.Base,
  GqlChain.Gnosis,
  GqlChain.Polygon,
  GqlChain.Zkevm,
  GqlChain.Optimism,
]

export const ProjectConfigBalancer: ProjectConfig = {
  projectId: 'balancer',
  projectName: 'Balancer',
  supportedNetworks: balancerSupportedNetworks,
}
