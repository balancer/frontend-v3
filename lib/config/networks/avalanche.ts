import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { NetworkConfig } from '../config.types'

const networkConfig: NetworkConfig = {
  chainId: 43114,
  name: 'Avalanche Mainnet',
  shortName: 'Avalanche',
  chain: GqlChain.Avalanche,
  iconPath: '/images/chains/AVALANCHE.svg',
  rpcUrl: 'https://avalanche-mainnet.infura.io/v3/77ab387b59ac47ee8acf46916b4d7c23',
  blockExplorerBaseUrl: 'https://snowtrace.io',
  tokens: {
    addresses: {
      bal: '0xe15bcb9e0ea69e6ab9fa080c4c4a5632896298c3',
      wNativeAsset: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    },
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
      relayerV6: '0xA084c11cb55e67C9becf9607f1DBB20ec4D5E7b2',
      minter: '0x85a80afee867aDf27B50BdB7b76DA70f1E853062',
    },
  },
}

export default networkConfig
