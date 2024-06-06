import { ProjectConfig } from '@/lib/config/config.types'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { PoolVariant } from '../../modules/pool/pool.types'

export const beetsSupportedNetworks = [GqlChain.Fantom, GqlChain.Optimism]
//  as const satisifies GqlChain[]

export const ProjectConfigBeets: ProjectConfig = {
  projectId: 'beets',
  projectName: 'BeethovenX',
  supportedNetworks: beetsSupportedNetworks,
  variantConfig: {
    [PoolVariant.v2]: {},
    [PoolVariant.v3]: {},
    [PoolVariant.cow]: {},
  },
}
