import { Feature, Options, ProjectConfig } from '@/lib/config/config.types'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

export const beetsSupportedNetworks = [GqlChain.Fantom, GqlChain.Optimism]
//  as const satisifies GqlChain[]

export const ProjectConfigBeets: ProjectConfig = {
  projectId: 'beets',
  projectName: 'BeethovenX',
  supportedNetworks: beetsSupportedNetworks,
  corePoolId: '0x9e4341acef4147196e99d648c5e43b3fc9d026780002000000000000000005ec', // maBEETS BEETS8020 (Fresh BEETS) pool on Fantom
  features: {
    [GqlChain.Fantom]: [Feature.mabeets, Feature.sftmx, Feature.masterchef],
    [GqlChain.Optimism]: [Feature.gauge],
  },
  options: [Options.poolname],
  defaultNetwork: GqlChain.Fantom,
  ecoSystemLinks: [],
  extraAppLinks: [
    { href: '/mabeets', label: 'maBEETS' },
    { href: '/sftmx', label: 'sFTMx' },
  ],
  socialLinks: [],
}
