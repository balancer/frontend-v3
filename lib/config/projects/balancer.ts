import { ProjectConfig } from '@/lib/config/config.types'
import { GqlChain } from '@/lib/services/api/generated/graphql'

export const ProjectConfigBalancer: ProjectConfig = {
  projectId: 'balancer',
  name: 'Balancer',
  supportedNetworks: [
    GqlChain.Mainnet,
    GqlChain.Arbitrum,
    GqlChain.Avalanche,
    GqlChain.Base,
    GqlChain.Gnosis,
    GqlChain.Polygon,
    GqlChain.Zkevm,
  ],
}
