import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { NetworkConfig } from '../config.types'

const networkConfig: NetworkConfig = {
  chainId: 137,
  name: 'Polygon Mainnet',
  shortName: 'Polygon',
  chain: GqlChain.Polygon,
  iconPath: '/images/chains/POLYGON.svg',
  rpcUrl: 'https://polygon-mainnet.infura.io/v3/77ab387b59ac47ee8acf46916b4d7c23',
  blockExplorerBaseUrl: 'https://polygonscan.com',
  tokens: {
    balToken: { address: '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3' },
    nativeAsset: {
      name: 'Matic',
      address: '0x0000000000000000000000000000000000001010',
      symbol: 'MATIC',
      decimals: 18,
    },
    defaultSwapTokens: {
      tokenIn: '0x0000000000000000000000000000000000001010',
    },
    popularTokens: [
      '0x0000000000000000000000000000000000001010', // MATIC
      '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC
      '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', // WETH
      '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3', // BAL
      '0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4', // stMATIC
    ],
  },
  contracts: {
    multicall2: '0x275617327c958bD06b5D6b871E7f491D76113dd8',
    balancer: {
      vaultV2: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
      relayerV6: '0xB1ED8d3b5059b3281D43306cC9D043cE8B22599b',
      minter: '0x47B489bf5836f83ABD928C316F8e39bC0587B020',
    },
  },
  minConfirmations: 13,
}

export default networkConfig
