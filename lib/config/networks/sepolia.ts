import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { NetworkConfig } from '../config.types'

const networkConfig: NetworkConfig = {
  chainId: 11155111,
  name: 'Ethereum Testnet Sepolia',
  shortName: 'Sepolia',
  chain: GqlChain.Sepolia,
  iconPath: '/images/chains/MAINNET.svg',
  rpcUrl: 'https://sepolia.infura.io/v3/77ab387b59ac47ee8acf46916b4d7c23',
  blockExplorerBaseUrl: 'https://sepolia.etherscan.io',
  tokens: {
    addresses: {
      bal: '0xb19382073c7a0addbb56ac6af1808fa49e377b75',
      wNativeAsset: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
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
      relayerV6: '0x7852fB9d0895e6e8b3EedA553c03F6e2F9124dF9',
      minter: '0x1783Cd84b3d01854A96B4eD5843753C2CcbD574A',
    },
  },
}

export default networkConfig
