import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { NetworkConfig } from '../config.types'

const networkConfig: NetworkConfig = {
  chainId: 137,
  name: 'Polygon Mainnet',
  shortName: 'Polygon',
  chain: GqlChain.Polygon,
  iconPath: '/images/chains/POLYGON.svg',
  blockExplorerBaseUrl: 'https://polygonscan.com',
  tokens: {
    nativeAsset: {
      name: 'Matic',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  contracts: {
    multicall2: '0x275617327c958bD06b5D6b871E7f491D76113dd8',
    balancer: {
      vaultV2: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
    },
  },
}

export default networkConfig
