'use client'

import { Chain } from '@rainbow-me/rainbowkit'
import {
  arbitrum,
  avalanche,
  base,
  fantom,
  fraxtal,
  gnosis,
  mainnet,
  mode,
  optimism,
  polygon,
  polygonZkEvm,
  sepolia,
} from 'wagmi/chains'

import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { keyBy } from 'lodash'

/* If a request with the default rpc fails, it will fall back to the next one in the list.
  https://viem.sh/docs/clients/transports/fallback#fallback-transport
*/
export const rpcFallbacks: Record<GqlChain, string | undefined> = {
  // TODO: chose best public rpc urls
  [GqlChain.Mainnet]: 'https://eth.llamarpc.com',
  [GqlChain.Arbitrum]: undefined,
  [GqlChain.Base]: undefined,
  [GqlChain.Avalanche]: undefined,
  [GqlChain.Fantom]: undefined,
  [GqlChain.Gnosis]: undefined,
  [GqlChain.Optimism]: undefined,
  [GqlChain.Polygon]: undefined,
  [GqlChain.Zkevm]: undefined,
  [GqlChain.Sepolia]: undefined,
  [GqlChain.Mode]: undefined,
  [GqlChain.Fraxtal]: undefined,
}

// Helpful for injecting fork RPCs for specific chains.
export const rpcOverrides: Record<GqlChain, string | undefined> = {
  [GqlChain.Mainnet]: undefined,
  [GqlChain.Arbitrum]: undefined,
  [GqlChain.Base]: undefined,
  [GqlChain.Avalanche]: undefined,
  [GqlChain.Fantom]: undefined,
  [GqlChain.Gnosis]: undefined,
  [GqlChain.Optimism]: undefined,
  [GqlChain.Polygon]: undefined,
  [GqlChain.Zkevm]: undefined,
  [GqlChain.Sepolia]: undefined,
  [GqlChain.Mode]: undefined,
  [GqlChain.Fraxtal]: undefined,
}

const customMainnet = { iconUrl: '/images/chains/MAINNET.svg', ...mainnet }
const gqlChainToWagmiChainMap = {
  [GqlChain.Mainnet]: customMainnet,
  [GqlChain.Arbitrum]: { iconUrl: '/images/chains/ARBITRUM.svg', ...arbitrum },
  [GqlChain.Base]: { iconUrl: '/images/chains/BASE.svg', ...base },
  [GqlChain.Avalanche]: { iconUrl: '/images/chains/AVALANCHE.svg', ...avalanche },
  [GqlChain.Fantom]: fantom,
  [GqlChain.Gnosis]: { iconUrl: '/images/chains/GNOSIS.svg', ...gnosis },
  [GqlChain.Optimism]: { iconUrl: '/images/chains/OPTIMISM.svg', ...optimism },
  [GqlChain.Polygon]: { iconUrl: '/images/chains/POLYGON.svg', ...polygon },
  [GqlChain.Zkevm]: { iconUrl: '/images/chains/ZKEVM.svg', ...polygonZkEvm },
  [GqlChain.Sepolia]: { iconUrl: '/images/chains/SEPOLIA.svg', ...sepolia },
  [GqlChain.Mode]: { iconUrl: '/images/chains/MODE.svg', ...mode },
  [GqlChain.Fraxtal]: { iconUrl: '/images/chains/FRAXTAL.svg', ...fraxtal },
} as const satisfies Record<GqlChain, Chain>

export const supportedNetworks = getProjectConfig().supportedNetworks
export const chains: readonly [Chain, ...Chain[]] = [
  customMainnet,
  ...supportedNetworks
    .filter(chain => chain !== GqlChain.Mainnet)
    .map(gqlChain => gqlChainToWagmiChainMap[gqlChain]),
]

export const chainsByKey = keyBy(chains, 'id')
export function getDefaultRpcUrl(chainId: number) {
  return chainsByKey[chainId].rpcUrls.default.http[0]
}
