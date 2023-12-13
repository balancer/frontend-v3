import { NetworkConfig } from '../config.types'

const networkConfig: NetworkConfig = {
  chainId: 250,
  name: 'Fantom Opera',
  shortName: 'Fantom',
  iconPath: '/images/chains/FANTOM.svg',
  blockExplorerBaseUrl: 'https://ftmscan.com',
  tokens: {
    nativeAsset: {
      name: 'Fantom',
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      symbol: 'FTM',
      decimals: 18,
    },
    defaultSwapTokens: {
      tokenIn: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    },
  },
  contracts: {
    multicall2: '0x66335d7ad8011f6aa3f48aadcb523b62b38ed961',
    balancer: {
      vaultV2: '0x20dd72Ed959b6147912C2e529F0a0C651c33c9ce',
    },
  },
}

export default networkConfig
