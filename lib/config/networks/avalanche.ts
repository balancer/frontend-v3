import { NetworkConfig } from '../config.types'

const networkConfig: NetworkConfig = {
  chainId: 1,
  name: 'Avalanche Mainnet',
  shortName: 'Avalanche',
  iconPath: '/images/chains/AVALANCHE.svg',
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
  },
}

export default networkConfig
