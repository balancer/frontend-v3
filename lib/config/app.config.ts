import { GqlChain } from '@/lib/services/api/generated/graphql'
import { keyBy } from 'lodash'
import { Config, NetworkConfig } from './config.types'
import networks from './networks'

export const config: Config = {
  appEnv: (process.env.NEXT_PUBLIC_APP_ENV as Config['appEnv']) || 'dev',
  apiUrl: process.env.NEXT_PUBLIC_BALANCER_API_URL || '',
  networks,
}

const networkConfigsKeyedOnChainId = keyBy(config.networks, 'chainId')

export function getNetworkConfig(chain: GqlChain | number | undefined): NetworkConfig {
  if (chain === undefined) return config.networks.MAINNET

  if (typeof chain === 'number') {
    return networkConfigsKeyedOnChainId[chain] || config.networks.MAINNET
  }

  return config.networks[chain]
}
