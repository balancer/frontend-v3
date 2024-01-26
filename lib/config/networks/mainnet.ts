import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { NetworkConfig } from '../config.types'

const networkConfig: NetworkConfig = {
  chainId: 1,
  name: 'Ethereum Mainnet',
  shortName: 'Ethereum',
  chain: GqlChain.Mainnet,
  iconPath: '/images/chains/MAINNET.svg',
  blockExplorerBaseUrl: 'https://etherscan.io',
  tokens: {
    nativeAsset: {
      name: 'Ether',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      symbol: 'ETH',
      decimals: 18,
    },
    defaultSwapTokens: {
      tokenIn: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
  },
  contracts: {
    multicall2: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
    balancer: {
      vaultV2: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
    },
  },
}

export default networkConfig
