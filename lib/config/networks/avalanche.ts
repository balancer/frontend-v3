import { NetworkConfig } from '../config.types'

const networkConfig: NetworkConfig = {
  chainId: 43114,
  name: 'Avalanche Mainnet',
  shortName: 'Avalanche',
  iconPath: '/images/chains/AVALANCHE.svg',
  etherscan: 'https://snowtrace.io',
  tokens: {
    nativeAsset: {
      name: 'Avalanche',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      symbol: 'AVAX',
      decimals: 18,
    },
  },
  contracts: {
    multicall2: '0xca11bde05977b3631167028862be2a173976ca11',
    balancer: {},
  },
}

export default networkConfig
