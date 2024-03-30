import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { NetworkConfig } from '../config.types'
import { convertHexToLowerCase } from '@/lib/shared/utils/objects'

const networkConfig: NetworkConfig = {
  chainId: 8453,
  name: 'Base Mainnet',
  shortName: 'Base',
  chain: GqlChain.Base,
  iconPath: '/images/chains/BASE.svg',
  blockExplorer: {
    baseUrl: 'https://basescan.org',
    name: 'BaseScan',
  },
  rpcUrl: 'https://base-mainnet.infura.io/v3/daaa68ec242643719749dd1caba2fc66',
  tokens: {
    addresses: {
      bal: '0x4158734d47fc9692176b5085e0f52ee0da5d47f1',
      wNativeAsset: '0x4200000000000000000000000000000000000006',
    },
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
      relayerV6: '0x7C3C773C878d2238a9b64d8CEE02377BF07ED06a',
      minter: '0x0c5538098EBe88175078972F514C9e101D325D4F',
    },
    veDelegationProxy: '0xD87F44Df0159DC78029AB9CA7D7e57E7249F5ACD',
  },
  pools: convertHexToLowerCase({ issues: {} }),
}

export default networkConfig
