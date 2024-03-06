import { Address } from 'viem'
import { GqlChain } from '../shared/services/api/generated/graphql'
import { supportedChains } from '../modules/web3/Web3Provider'
import { PoolIssue } from '../modules/pool/alerts/pool-issues/PoolIssue.type'

export interface TokensConfig {
  balToken?: { address: Address }
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
  feeDistributor?: Address
}
export interface PoolsConfig {
  issues?: Partial<Record<PoolIssue, string[]>>
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
  minConfirmations?: number
  pools?: PoolsConfig //TODO: make it required once we add pool config for all networks
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
