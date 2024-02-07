import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { NetworkConfig } from '../config.types'

const networkConfig: NetworkConfig = {
  chainId: 43114,
  name: 'Avalanche Mainnet',
  shortName: 'Avalanche',
  chain: GqlChain.Avalanche,
  iconPath: '/images/chains/AVALANCHE.svg',
  blockExplorerBaseUrl: 'https://snowtrace.io',
  tokens: {
    nativeAsset: {
      name: 'Avalanche',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      symbol: 'AVAX',
      decimals: 18,
    },
    defaultSwapTokens: {
      tokenIn: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
  },
  contracts: {
    multicall2: '0xca11bde05977b3631167028862be2a173976ca11',
    balancer: {
      vaultV2: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
      relayerV6: '0x35Cea9e57A393ac66Aaa7E25C391D52C74B5648f',
      minter: '0x',
    },
  },
}

export default networkConfig
