import { ProjectConfig } from '@/lib/config/config.types'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import {
  arbitrum,
  avalanche,
  base,
  gnosis,
  mainnet,
  optimism,
  polygon,
  polygonZkEvm,
  sepolia,
} from 'wagmi/chains'
import { getGqlChain } from '../app.config'

export const balancerSupportedNetworks = [
  GqlChain.Mainnet,
  GqlChain.Arbitrum,
  GqlChain.Avalanche,
  GqlChain.Base,
  GqlChain.Gnosis,
  GqlChain.Polygon,
  GqlChain.Zkevm,
  GqlChain.Optimism,
] as const

export const balancerSupportedChains = [
  mainnet,
  arbitrum,
  base,
  avalanche,
  gnosis,
  optimism,
  polygon,
  polygonZkEvm,
  sepolia,
] as const

export const ProjectConfigBalancer: ProjectConfig = {
  projectId: 'balancer',
  projectName: 'Balancer',
  supportedChains: balancerSupportedChains,
  supportedNetworks: balancerSupportedChains.map(chain => getGqlChain(chain.id)),
}
