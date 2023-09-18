import { NetworkConfig } from '../config.types'

const networkConfig: NetworkConfig = {
  chainId: 137,
  name: 'Polygon Mainnet',
  shortName: 'Polygon',
  iconPath: '/images/chains/POLYGON.svg',
  tokens: {
    nativeAsset: {
      name: 'Matic',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  minConfirmations: 1,
  contracts: {
    multicall2: '0x275617327c958bD06b5D6b871E7f491D76113dd8',
    balancer: {},
  },
}

export default networkConfig
