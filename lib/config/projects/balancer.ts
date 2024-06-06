import { ProjectConfig } from '@/lib/config/config.types'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { PoolVariant } from '../../modules/pool/pool.types'

export const ProjectConfigBalancer: ProjectConfig = {
  projectId: 'balancer',
  projectName: 'Balancer',
  supportedNetworks: [
    GqlChain.Mainnet,
    GqlChain.Arbitrum,
    GqlChain.Avalanche,
    GqlChain.Base,
    GqlChain.Gnosis,
    GqlChain.Polygon,
    GqlChain.Zkevm,
    GqlChain.Optimism,
    // GqlChain.Mode,
    // GqlChain.Fraxtal,
  ],
  variantConfig: {
    [PoolVariant.v2]: {},
    [PoolVariant.v3]: {},
    [PoolVariant.cow]: {
      banners: {
        headerSrc: '/images/partners/cow-header.svg',
        footerSrc: '/images/partners/cow-footer.svg',
      },
    },
  },
}
