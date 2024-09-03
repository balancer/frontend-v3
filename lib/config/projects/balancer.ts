import { Features, ProjectConfig } from '@/lib/config/config.types'
import { PartnerVariant } from '@/lib/modules/pool/pool.types'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { isProd } from '@/lib/config/app.config'

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
    GqlChain.Mode,
    GqlChain.Fraxtal,

    // testnets only in dev mode
    ...(isProd ? [] : [GqlChain.Sepolia]),
  ],
  variantConfig: {
    [PartnerVariant.cow]: {
      banners: {
        headerSrc: '/images/partners/cow-header.svg',
        footerSrc: '/images/partners/cow-footer.svg',
      },
    },
  },
  corePoolId: '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014', // veBAL BAL8020 (Balancer 80 BAL 20 WETH) pool on Ethereum
  features: {
    [GqlChain.Mainnet]: [Features.vebal, Features.gauge],
    [GqlChain.Arbitrum]: [Features.vebal, Features.gauge],
    [GqlChain.Avalanche]: [Features.vebal, Features.gauge],
    [GqlChain.Base]: [Features.vebal, Features.gauge],
    [GqlChain.Fraxtal]: [Features.vebal, Features.gauge],
    [GqlChain.Gnosis]: [Features.vebal, Features.gauge],
    [GqlChain.Polygon]: [Features.vebal, Features.gauge],
    [GqlChain.Zkevm]: [Features.vebal, Features.gauge],
    [GqlChain.Optimism]: [Features.vebal, Features.gauge],
    [GqlChain.Mode]: [Features.vebal, Features.gauge],
    [GqlChain.Sepolia]: [Features.vebal, Features.gauge],
    [GqlChain.Fantom]: [],
  },
  options: [],
  defaultNetwork: GqlChain.Mainnet,
}
