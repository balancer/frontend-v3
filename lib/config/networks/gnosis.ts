import { NetworkConfig } from '../config.types'

const networkConfig: NetworkConfig = {
  chainId: 137,
  name: 'Polygon Mainnet',
  shortName: 'Polygon',
  iconPath: '/images/chains/POLYGON.svg',
  tokens: {
    nativeAsset: {
      name: 'Matic',
      address: '0x0000000000000000000000000000000000001010',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  contracts: {
    multicall2: '0x275617327c958bd06b5d6b871e7f491d76113dd8',
  },
}

export default networkConfig
