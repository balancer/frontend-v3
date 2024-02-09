import { Address } from 'viem'
import { GqlChain } from '../shared/services/api/generated/graphql'
import { supportedChains } from '../modules/web3/Web3Provider'

export interface TokensConfig {
  nativeAsset: {
    name: string
    address: Address
    symbol: string
    decimals: number
  }
  doubleApprovalRequired?: string[]
  defaultSwapTokens?: {
    tokenIn?: Address
    tokenOut?: Address
  }
  popularTokens?: Address[]
}

export interface ContractsConfig {
  multicall2: Address
  balancer: {
    vaultV2: Address
    relayerV6: Address
    minter: Address
  }
}

export type SupportedChainId = (typeof supportedChains)[number]['id']
export interface NetworkConfig {
  chainId: SupportedChainId
  name: string
  shortName: string
  chain: GqlChain
  iconPath: string
  blockExplorerBaseUrl: string
  tokens: TokensConfig
  contracts: ContractsConfig
}

export interface Config {
  appEnv: 'dev' | 'staging' | 'prod'
  apiUrl: string
  networks: {
    [key in GqlChain]: NetworkConfig
  }
}

export interface ProjectConfig {
  projectId: 'beets' | 'balancer'
  projectName: string
  supportedNetworks: GqlChain[]
}
