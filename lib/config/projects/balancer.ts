import { Feature, ProjectConfig } from '@/lib/config/config.types'
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
    [GqlChain.Mainnet]: [Feature.vebal, Feature.gauge],
    [GqlChain.Arbitrum]: [Feature.vebal, Feature.gauge],
    [GqlChain.Avalanche]: [Feature.vebal, Feature.gauge],
    [GqlChain.Base]: [Feature.vebal, Feature.gauge],
    [GqlChain.Fraxtal]: [Feature.vebal, Feature.gauge],
    [GqlChain.Gnosis]: [Feature.vebal, Feature.gauge],
    [GqlChain.Polygon]: [Feature.vebal, Feature.gauge],
    [GqlChain.Zkevm]: [Feature.vebal, Feature.gauge],
    [GqlChain.Optimism]: [Feature.vebal, Feature.gauge],
    [GqlChain.Mode]: [Feature.vebal, Feature.gauge],
    [GqlChain.Sepolia]: [Feature.vebal, Feature.gauge],
  },
  options: [],
  defaultNetwork: GqlChain.Mainnet,
  ecoSystemLinks: [
    { label: 'Build', href: 'https://balancer.fi/build' },
    { label: 'Blog', href: 'https://medium.com/balancer-protocol' },
    { label: 'Docs', href: 'https://docs.balancer.fi/' },
    { label: 'Governance', href: 'https://vote.balancer.fi/#/' },
    { label: 'Analytics', href: 'https://dune.com/balancer' },
    { label: 'Forum', href: 'https://forum.balancer.fi/' },
    {
      label: 'Grants',
      href: 'https://grants.balancer.community',
    },
  ],
  extraAppLinks: [],
  socialLinks: [
    {
      label: 'x',
      href: 'https://x.com/Balancer',
    },
    {
      label: 'discord',
      href: 'https://discord.balancer.fi/',
    },
    {
      label: 'medium',
      href: 'https://medium.com/balancer-protocol',
    },
    {
      label: 'youtube',
      href: 'https://www.youtube.com/channel/UCBRHug6Hu3nmbxwVMt8x_Ow',
    },
    {
      label: 'github',
      href: 'https://github.com/balancer/',
    },
  ],
}
