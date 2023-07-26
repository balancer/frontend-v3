import { GqlChain } from '@/lib/services/api/generated/graphql'

interface NetworkConfig {
  chainId: number
  name: string
  shortName: string
  iconPath: string
}

interface Config {
  appEnv: 'dev' | 'stag' | 'prod'
  network: {
    [key in GqlChain]: NetworkConfig
  }
}

export const config: Config = {
  appEnv: (process.env.APP_ENV as Config['appEnv']) || 'dev',
  network: {
    [GqlChain.Arbitrum]: {
      chainId: 42161,
      name: 'Arbitrum One',
      shortName: 'Arbitrum',
      iconPath: '/images/chains/ARBITRUM.svg',
    },
    [GqlChain.Avalanche]: {
      chainId: 1,
      name: 'Avalanche Mainnet',
      shortName: 'Avalanche',
      iconPath: '/images/chains/AVALANCHE.svg',
    },
    [GqlChain.Gnosis]: {
      chainId: 100,
      name: 'Gnosis Chain',
      shortName: 'Gnosis',
      iconPath: '/images/chains/GNOSIS.svg',
    },
    [GqlChain.Mainnet]: {
      chainId: 1,
      name: 'Ethereum Mainnet',
      shortName: 'Ethereum',
      iconPath: '/images/chains/MAINNET.svg',
    },
    [GqlChain.Polygon]: {
      chainId: 137,
      name: 'Polygon Mainnet',
      shortName: 'Polygon',
      iconPath: '/images/chains/POLYGON.svg',
    },
    [GqlChain.Zkevm]: {
      chainId: 1101,
      name: 'Polygon zkEVM Mainnet',
      shortName: 'zkEVM',
      iconPath: '/images/chains/ZKEVM.svg',
    },
    [GqlChain.Fantom]: {
      chainId: 250,
      name: 'Fantom Opera',
      shortName: 'Fantom',
      iconPath: '/images/chains/FANTOM.svg',
    },
    [GqlChain.Optimism]: {
      chainId: 10,
      name: 'Optimism Mainnet',
      shortName: 'Optimism',
      iconPath: '/images/chains/OPTIMISM.svg',
    },
  },
}

export function networkConfigFor(chain: GqlChain): NetworkConfig {
  return config.network[chain]
}
