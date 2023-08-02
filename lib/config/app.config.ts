import { GqlChain } from '@/lib/services/api/generated/graphql'
import { keyBy } from 'lodash'
import { Address } from 'viem'

interface NetworkConfig {
  chainId: number
  name: string
  shortName: string
  iconPath: string
  eth: {
    name: string
    address: Address
    symbol: string
    decimals: number
  }
  multicall2: Address
}

interface Config {
  appEnv: 'dev' | 'staging' | 'prod'
  apiUrl: string
  network: {
    [key in GqlChain]: NetworkConfig
  }
}

export const config: Config = {
  appEnv: (process.env.NEXT_PUBLIC_APP_ENV as Config['appEnv']) || 'dev',
  apiUrl: process.env.NEXT_PUBLIC_BALANCER_API_URL || '',
  network: {
    [GqlChain.Arbitrum]: {
      chainId: 42161,
      name: 'Arbitrum One',
      shortName: 'Arbitrum',
      iconPath: '/images/chains/ARBITRUM.svg',
      eth: {
        name: 'Ether',
        address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        symbol: 'ETH',
        decimals: 18,
      },
      multicall2: '0x80c7dd17b01855a6d2347444a0fcc36136a314de',
    },
    [GqlChain.Avalanche]: {
      chainId: 1,
      name: 'Avalanche Mainnet',
      shortName: 'Avalanche',
      iconPath: '/images/chains/AVALANCHE.svg',
      eth: {
        name: 'Avalanche',
        address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        symbol: 'AVAX',
        decimals: 18,
      },
      multicall2: '0xca11bde05977b3631167028862be2a173976ca11',
    },
    [GqlChain.Gnosis]: {
      chainId: 100,
      name: 'Gnosis Chain',
      shortName: 'Gnosis',
      iconPath: '/images/chains/GNOSIS.svg',
      eth: {
        name: 'xDAI',
        address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        symbol: 'xDAI',
        decimals: 18,
      },
      multicall2: '0xbb6fab6b627947dae0a75808250d8b2652952cb5',
    },
    [GqlChain.Mainnet]: {
      chainId: 1,
      name: 'Ethereum Mainnet',
      shortName: 'Ethereum',
      iconPath: '/images/chains/MAINNET.svg',
      eth: {
        name: 'Ether',
        address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        symbol: 'ETH',
        decimals: 18,
      },
      multicall2: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
    },
    [GqlChain.Polygon]: {
      chainId: 137,
      name: 'Polygon Mainnet',
      shortName: 'Polygon',
      iconPath: '/images/chains/POLYGON.svg',
      eth: {
        name: 'Matic',
        address: '0x0000000000000000000000000000000000001010',
        symbol: 'MATIC',
        decimals: 18,
      },
      multicall2: '0x275617327c958bd06b5d6b871e7f491d76113dd8',
    },
    [GqlChain.Zkevm]: {
      chainId: 1101,
      name: 'Polygon zkEVM Mainnet',
      shortName: 'zkEVM',
      iconPath: '/images/chains/ZKEVM.svg',
      eth: {
        name: 'Ether',
        address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        symbol: 'ETH',
        decimals: 18,
      },
      multicall2: '0xca11bde05977b3631167028862be2a173976ca11',
    },
    [GqlChain.Fantom]: {
      chainId: 250,
      name: 'Fantom Opera',
      shortName: 'Fantom',
      iconPath: '/images/chains/FANTOM.svg',
      eth: {
        name: 'Fantom',
        address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        symbol: 'FTM',
        decimals: 18,
      },
      multicall2: '0x66335d7ad8011f6aa3f48aadcb523b62b38ed961',
    },
    [GqlChain.Optimism]: {
      chainId: 10,
      name: 'Optimism Mainnet',
      shortName: 'Optimism',
      iconPath: '/images/chains/OPTIMISM.svg',
      eth: {
        name: 'Ether',
        address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        symbol: 'ETH',
        decimals: 18,
      },
      multicall2: '0x2dc0e2aa608532da689e89e237df582b783e552c',
    },
  },
}

const networkConfigsKeyedOnChainId = keyBy(config.network, 'chainId')

export function networkConfigFor(chain: GqlChain): NetworkConfig {
  return config.network[chain]
}

export function networkConfigForChainId(chainId: number): NetworkConfig {
  return networkConfigsKeyedOnChainId[chainId] || config.network.MAINNET
}
