import { GqlChain } from '@/lib/services/api/generated/graphql'
import { keyBy } from 'lodash'
import { Config, NetworkConfig } from './config.types'
import networks from './networks'

export const config: Config = {
  appEnv: (process.env.NEXT_PUBLIC_APP_ENV as Config['appEnv']) || 'dev',
  apiUrl: process.env.NEXT_PUBLIC_BALANCER_API_URL || '',
  networks,
}

const networksByChainId = keyBy(config.networks, 'chainId')

/**
 * Fetches network config by chainId or network name type from API (GqlChain). If chain
 * param is not provided or incorrect, it will return mainnet config.
 */
export function getNetworkConfig(chain?: GqlChain | number): NetworkConfig {
  if (!chain) return config.networks.MAINNET

  if (typeof chain === 'number') {
    return networksByChainId[chain] || config.networks.MAINNET
  }

  return config.networks[chain]
}
