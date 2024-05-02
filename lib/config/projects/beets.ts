import { ProjectConfig } from '@/lib/config/config.types'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

export const beetsSupportedChains = [
  GqlChain.Fantom,
  GqlChain.Optimism,
] as const satisfies GqlChain[]

export const ProjectConfigBeets: ProjectConfig = {
  projectId: 'beets',
  projectName: 'BeethovenX',
  supportedNetworks: beetsSupportedChains,
}
