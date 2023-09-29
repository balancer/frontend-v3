import { Address } from 'viem'
import { GqlChain } from '../services/api/generated/graphql'

export interface TokensConfig {
  nativeAsset: {
    name: string
    address: Address
    symbol: string
    decimals: number
  }
}

export interface ContractsConfig {
  multicall2: Address
  balancer: { vaultV2?: Address }
}

export interface NetworkConfig {
  chainId: number
  name: string
  shortName: string
  iconPath: string
  tokens: TokensConfig
  contracts: ContractsConfig
  minConfirmations: number
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
