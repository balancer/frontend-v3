import { NetworkConfig } from '../config.types'

const networkConfig: NetworkConfig = {
  chainId: 10,
  name: 'Optimism Mainnet',
  shortName: 'Optimism',
  iconPath: '/images/chains/OPTIMISM.svg',
  blockExplorerBaseUrl: 'https://optimistic.etherscan.io',
  tokens: {
    nativeAsset: {
      name: 'Ether',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  contracts: {
    multicall2: '0x2dc0e2aa608532da689e89e237df582b783e552c',
    balancer: {
      vaultV2: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
    },
  },
}

export default networkConfig
