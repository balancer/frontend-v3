import { NetworkConfig } from '../config.types'

const networkConfig: NetworkConfig = {
  chainId: 1,
  name: 'Ethereum Mainnet',
  shortName: 'Ethereum',
  iconPath: '/images/chains/MAINNET.svg',
  tokens: {
    nativeAsset: {
      name: 'Ether',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  contracts: {
    multicall2: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
    balancer: {
      vaultV2: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
      // TODO: This is a temporary workaround until we find a generic way to
      wsETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    },
  },
}

export default networkConfig
