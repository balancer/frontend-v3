import { NetworkConfig } from '../config.types'

const networkConfig: NetworkConfig = {
  chainId: 100,
  name: 'Gnosis Chain',
  shortName: 'Gnosis',
  iconPath: '/images/chains/GNOSIS.svg',
  tokens: {
    nativeAsset: {
      name: 'xDAI',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      symbol: 'xDAI',
      decimals: 18,
    },
  },
  minConfirmations: 1,
  contracts: {
    multicall2: '0xbb6fab6b627947dae0a75808250d8b2652952cb5',
    balancer: {},
  },
}

export default networkConfig
