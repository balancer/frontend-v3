import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { NetworkConfig } from '../config.types'

const networkConfig: NetworkConfig = {
  chainId: 1101,
  name: 'Polygon zkEVM Mainnet',
  shortName: 'zkEVM',
  chain: GqlChain.Zkevm,
  iconPath: '/images/chains/ZKEVM.svg',
  blockExplorerBaseUrl: 'https://zkevm.polygonscan.com',
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
    multicall2: '0xca11bde05977b3631167028862be2a173976ca11',
    balancer: {
      vaultV2: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
      relayer: '0x35Cea9e57A393ac66Aaa7E25C391D52C74B5648f',
    },
  },
}

export default networkConfig
