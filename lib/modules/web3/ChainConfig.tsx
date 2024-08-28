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
import { getBaseUrl } from '@/lib/shared/utils/urls'

/* If a request with the default rpc fails, it will fall back to the next one in the list.
  https://viem.sh/docs/clients/transports/fallback#fallback-transport
*/
export const rpcFallbacks: Record<GqlChain, string | undefined> = {
  [GqlChain.Mainnet]: 'https://eth.llamarpc.com',
  [GqlChain.Arbitrum]: 'https://arbitrum.llamarpc.com',
  [GqlChain.Base]: 'https://base.llamarpc.com',
  [GqlChain.Avalanche]: 'https://avalanche.drpc.org',
  [GqlChain.Fantom]: 'https://rpcapi.fantom.network',
  [GqlChain.Gnosis]: 'https://gnosis.drpc.org',
  [GqlChain.Optimism]: 'https://optimism.drpc.org',
  [GqlChain.Polygon]: 'https://polygon.llamarpc.com',
  [GqlChain.Zkevm]: 'https://polygon-zkevm.drpc.org',
  [GqlChain.Sepolia]: 'https://sepolia.gateway.tenderly.co',
  [GqlChain.Mode]: 'https://mode.drpc.org',
  [GqlChain.Fraxtal]: 'https://fraxtal.gateway.tenderly.co/',
}

const baseUrl = getBaseUrl()
const shouldUsePrivateRpc = !!process.env.PRIVATE_ALCHEMY_KEY
const getPrivateRpcUrl = (chain: GqlChain) => `${baseUrl}/api/rpc/${chain}`
const getRpcOverride = (chain: GqlChain) => {
  if (shouldUsePrivateRpc) {
    return getPrivateRpcUrl(chain)
  }
  return undefined
}

export const rpcOverrides: Record<GqlChain, string | undefined> = {
  [GqlChain.Mainnet]: getRpcOverride(GqlChain.Mainnet),
  [GqlChain.Arbitrum]: getRpcOverride(GqlChain.Arbitrum),
  [GqlChain.Base]: getRpcOverride(GqlChain.Base),
  [GqlChain.Avalanche]: getRpcOverride(GqlChain.Avalanche),
  [GqlChain.Fantom]: getRpcOverride(GqlChain.Fantom),
  [GqlChain.Gnosis]: getRpcOverride(GqlChain.Gnosis),
  [GqlChain.Optimism]: getRpcOverride(GqlChain.Optimism),
  [GqlChain.Polygon]: getRpcOverride(GqlChain.Polygon),
  [GqlChain.Zkevm]: getRpcOverride(GqlChain.Zkevm),
  [GqlChain.Sepolia]: getRpcOverride(GqlChain.Sepolia),
  [GqlChain.Mode]: undefined,
  [GqlChain.Fraxtal]: getRpcOverride(GqlChain.Fraxtal),
}

const customMainnet = { iconUrl: '/images/chains/MAINNET.svg', ...mainnet }
const customFantom = { iconUrl: '/images/chains/FANTOM.svg', ...fantom }

const gqlChainToWagmiChainMap = {
  [GqlChain.Mainnet]: customMainnet,
  [GqlChain.Arbitrum]: { iconUrl: '/images/chains/ARBITRUM.svg', ...arbitrum },
  [GqlChain.Base]: { iconUrl: '/images/chains/BASE.svg', ...base },
  [GqlChain.Avalanche]: { iconUrl: '/images/chains/AVALANCHE.svg', ...avalanche },
  [GqlChain.Fantom]: customFantom,
  [GqlChain.Gnosis]: { iconUrl: '/images/chains/GNOSIS.svg', ...gnosis },
  [GqlChain.Optimism]: { iconUrl: '/images/chains/OPTIMISM.svg', ...optimism },
  [GqlChain.Polygon]: { iconUrl: '/images/chains/POLYGON.svg', ...polygon },
  [GqlChain.Zkevm]: { iconUrl: '/images/chains/ZKEVM.svg', ...polygonZkEvm },
  [GqlChain.Sepolia]: { iconUrl: '/images/chains/SEPOLIA.svg', ...sepolia },
  [GqlChain.Mode]: { iconUrl: '/images/chains/MODE.svg', ...mode },
  [GqlChain.Fraxtal]: { iconUrl: '/images/chains/FRAXTAL.svg', ...fraxtal },
} as const satisfies Record<GqlChain, Chain>

export const supportedNetworks = getProjectConfig().supportedNetworks

const chainToFilter = getProjectConfig().defaultNetwork
const customChain = gqlChainToWagmiChainMap[chainToFilter]

export const chains: readonly [Chain, ...Chain[]] = [
  customChain,
  ...supportedNetworks
    .filter(chain => chain !== chainToFilter)
    .map(gqlChain => gqlChainToWagmiChainMap[gqlChain]),
]

export const chainsByKey = keyBy(chains, 'id')
export function getDefaultRpcUrl(chainId: number) {
  return chainsByKey[chainId].rpcUrls.default.http[0]
}
