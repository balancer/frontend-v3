import { NetworkConfig } from '../config.types'

const networkConfig: NetworkConfig = {
  chainId: 8453,
  name: 'Base Mainnet',
  shortName: 'Base',
  iconPath: '/images/chains/BASE.svg',
  tokens: {
    nativeAsset: {
      name: 'Ether',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  minConfirmations: 1,
  contracts: {
    multicall2: '0xca11bde05977b3631167028862be2a173976ca11',
    balancer: {},
  },
}

export default networkConfig
