import { ProjectConfig } from '@/lib/config/config.types'
import { GqlChain } from '@/lib/services/api/generated/graphql'

export const ProjectConfigBeets: ProjectConfig = {
  projectId: 'beets',
  projectName: 'BeethovenX',
  supportedNetworks: [GqlChain.Fantom, GqlChain.Optimism],
}
