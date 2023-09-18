import { NetworkConfig } from '../config.types'

const networkConfig: NetworkConfig = {
  chainId: 250,
  name: 'Fantom Opera',
  shortName: 'Fantom',
  iconPath: '/images/chains/FANTOM.svg',
  tokens: {
    nativeAsset: {
      name: 'Fantom',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      symbol: 'FTM',
      decimals: 18,
    },
  },
  minConfirmations: 1,
  contracts: {
    multicall2: '0x66335d7ad8011f6aa3f48aadcb523b62b38ed961',
    balancer: {},
  },
}

export default networkConfig
