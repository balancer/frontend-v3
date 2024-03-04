import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { NetworkConfig } from '../config.types'

const networkConfig: NetworkConfig = {
  chainId: 100,
  name: 'Gnosis Chain',
  shortName: 'Gnosis',
  chain: GqlChain.Gnosis,
  iconPath: '/images/chains/GNOSIS.svg',
  rpcUrl: 'https://rpc.gnosischain.com',
  blockExplorerBaseUrl: 'https://gnosisscan.io',
  tokens: {
    balToken: { address: '0x7ef541e2a22058048904fe5744f9c7e4c57af717' },
    nativeAsset: {
      name: 'xDAI',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      symbol: 'xDAI',
      decimals: 18,
    },
    defaultSwapTokens: {
      tokenIn: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
  },
  contracts: {
    multicall2: '0xbb6fab6b627947dae0a75808250d8b2652952cb5',
    balancer: {
      vaultV2: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
      relayerV6: '0x2163c2FcD0940e84B8a68991bF926eDfB0Cd926C',
      minter: '0xA8920455934Da4D853faac1f94Fe7bEf72943eF1',
    },
  },
}

export default networkConfig
