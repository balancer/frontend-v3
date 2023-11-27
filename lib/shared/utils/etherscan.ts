import { GqlChain } from '../services/api/generated/graphql'

export const ChainToEtherscanBaseUrlMap: Record<GqlChain, string> = {
  [GqlChain.Arbitrum]: 'https://arbiscan.io',
  [GqlChain.Avalanche]: 'https://snowtrace.io',
  [GqlChain.Base]: 'https://basescan.org',
  [GqlChain.Fantom]: 'https://ftmscan.com',
  [GqlChain.Gnosis]: 'https://gnosisscan.io',
  [GqlChain.Mainnet]: 'https://etherscan.io',
  [GqlChain.Optimism]: 'https://optimistic.etherscan.io',
  [GqlChain.Polygon]: 'https://polygonscan.com',
  [GqlChain.Zkevm]: 'https://zkevm.polygonscan.com',
}
