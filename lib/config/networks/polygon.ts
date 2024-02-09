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
      address: '0x0000000000000000000000000000000000001010',
      symbol: 'MATIC',
      decimals: 18,
    },
    defaultSwapTokens: {
      tokenIn: '0x0000000000000000000000000000000000001010',
    },
  },
  contracts: {
    multicall2: '0x275617327c958bD06b5D6b871E7f491D76113dd8',
    balancer: {
      vaultV2: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
      relayerV6: '0xB1ED8d3b5059b3281D43306cC9D043cE8B22599b',
      minter: '0x47B489bf5836f83ABD928C316F8e39bC0587B020',
    },
  },
}

export default networkConfig
