import { ProjectConfig } from '@/lib/config/config.types'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

export const beetsSupportedNetworks = [GqlChain.Fantom, GqlChain.Optimism]
//  as const satisifies GqlChain[]

export const ProjectConfigBeets: ProjectConfig = {
  projectId: 'beets',
  projectName: 'BeethovenX',
  supportedNetworks: beetsSupportedNetworks,
}
