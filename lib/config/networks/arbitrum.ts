import { NetworkConfig } from '../config.types'

const networkConfig: NetworkConfig = {
  chainId: 42161,
  name: 'Arbitrum One',
  shortName: 'Arbitrum',
  iconPath: '/images/chains/ARBITRUM.svg',
  blockExplorerBaseUrl: 'https://arbiscan.io',
  tokens: {
    nativeAsset: {
      name: 'Ether',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  contracts: {
    multicall2: '0x80c7dd17b01855a6d2347444a0fcc36136a314de',
    balancer: {},
  },
}

export default networkConfig
