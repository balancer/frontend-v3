import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { NetworkConfig } from '../config.types'
import { zeroAddress } from 'viem'

const networkConfig: NetworkConfig = {
  chainId: 250,
  name: 'Fantom Opera',
  shortName: 'Fantom',
  chain: GqlChain.Fantom,
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
      relayerV6: '0x0faa25293a36241c214f3760c6ff443e1b731981',
      minter: zeroAddress,
    },
  },
}

export default networkConfig
