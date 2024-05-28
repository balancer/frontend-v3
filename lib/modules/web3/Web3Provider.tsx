'use client'

import '@rainbow-me/rainbowkit/styles.css'

import {
  darkTheme,
  lightTheme,
  RainbowKitProvider,
  Theme,
  connectorsForWallets,
  Chain,
} from '@rainbow-me/rainbowkit'

import { WagmiProvider, http, fallback, createConfig } from 'wagmi'

import {
  arbitrum,
  avalanche,
  base,
  fantom,
  gnosis,
  mainnet,
  optimism,
  polygon,
  polygonZkEvm,
  sepolia,
} from 'wagmi/chains'

import { keyBy, merge } from 'lodash'
import { useTheme } from '@chakra-ui/react'
import { balTheme } from '@/lib/shared/services/chakra/theme'
import { CustomAvatar } from './CustomAvatar'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { UserAccountProvider } from './UserAccountProvider'
import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'
import { BlockedAddressModal } from './BlockedAddressModal'
import { AcceptPoliciesModal } from './AcceptPoliciesModal'
import { UserSettingsProvider } from '../user/settings/UserSettingsProvider'
import { ReactQueryClientProvider } from '@/app/react-query.provider'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { getGqlChain } from '@/lib/config/app.config'
import { SupportedChainId } from '@/lib/config/config.types'
import {
  injectedWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  walletConnectWallet,
  safeWallet,
  coinbaseWallet,
} from '@rainbow-me/rainbowkit/wallets'

// Helpful for injecting fork RPCs for specific chains.
const rpcOverrides: Record<GqlChain, string | undefined> = {
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
}

const gqlChainToWagmiChainMap = {
  [GqlChain.Mainnet]: { iconUrl: '/images/chains/MAINNET.svg', ...mainnet },
  [GqlChain.Arbitrum]: { iconUrl: '/images/chains/ARBITRUM.svg', ...arbitrum },
  [GqlChain.Base]: { iconUrl: '/images/chains/BASE.svg', ...base },
  [GqlChain.Avalanche]: { iconUrl: '/images/chains/AVALANCHE.svg', ...avalanche },
  [GqlChain.Fantom]: fantom,
  [GqlChain.Gnosis]: { iconUrl: '/images/chains/GNOSIS.svg', ...gnosis },
  [GqlChain.Optimism]: { iconUrl: '/images/chains/OPTIMISM.svg', ...optimism },
  [GqlChain.Polygon]: { iconUrl: '/images/chains/POLYGON.svg', ...polygon },
  [GqlChain.Zkevm]: { iconUrl: '/images/chains/ZKEVM.svg', ...polygonZkEvm },
  [GqlChain.Sepolia]: sepolia,
} as const satisfies Record<GqlChain, Chain>

export const supportedNetworks = getProjectConfig().supportedNetworks
export const chains: readonly [Chain, ...Chain[]] = [
  mainnet,
  ...supportedNetworks
    .filter(chain => chain !== GqlChain.Mainnet)
    .map(gqlChain => gqlChainToWagmiChainMap[gqlChain]),
]

const chainsByKey = keyBy(chains, 'id')
export function getDefaultRpcUrl(chainId: number) {
  return chainsByKey[chainId].rpcUrls.default.http[0]
}

// TODO: define public urls as fallback??
function getTransports(chain: Chain) {
  const overridenRpcUrl = rpcOverrides[getGqlChain(chain.id as SupportedChainId)]
  return fallback([
    http(overridenRpcUrl),
    http(), // Public transport as first option
  ])
}

const transports = Object.fromEntries(
  chains.map(chain => [chain.id, getTransports(chain)])
) as Record<number, ReturnType<typeof getTransports>>

const appName = getProjectConfig().projectName
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || ''
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        injectedWallet,
        metaMaskWallet,
        rabbyWallet,
        rainbowWallet,
        safeWallet,
        coinbaseWallet,
        walletConnectWallet,
      ],
    },
  ],
  { appName, projectId }
)

export const wagmiConfig = createConfig({
  chains,
  transports,
  connectors,
  ssr: true,
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const { colors, radii, shadows, semanticTokens } = useTheme()
  const colorMode = useThemeColorMode()
  const colorModeKey = colorMode === 'light' ? 'default' : '_dark'

  const sharedConfig = {
    fonts: {
      body: balTheme.fonts?.body,
    },
    radii: {
      connectButton: radii.md,
      actionButton: radii.md,
      menuButton: radii.md,
      modal: radii.md,
      modalMobile: radii.md,
    },
    shadows: {
      connectButton: shadows.md,
      dialog: shadows.xl,
      profileDetailsAction: shadows.md,
      selectedOption: shadows.md,
      selectedWallet: shadows.md,
      walletLogo: shadows.md,
    },
    colors: {
      accentColor: colors.purple[500],
      // accentColorForeground: '...',
      // actionButtonBorder: '...',
      // actionButtonBorderMobile: '...',
      // actionButtonSecondaryBackground: '...',
      // closeButton: '...',
      // closeButtonBackground: '...',
      // connectButtonBackground: '#000000',
      // connectButtonBackgroundError: '...',
      // connectButtonInnerBackground: '#000000',
      // connectButtonText: '...',
      // connectButtonTextError: '...',
      // connectionIndicator: '...',
      // downloadBottomCardBackground: '...',
      // downloadTopCardBackground: '...',
      // error: '...',
      // generalBorder: '...',
      // generalBorderDim: '...',
      // menuItemBackground: '...',
      // modalBackdrop: '...',
      modalBackground: semanticTokens.colors.background.base[colorModeKey],
      // modalBorder: '...',
      modalText: semanticTokens.colors.font.primary[colorModeKey],
      // modalTextDim: '...',
      // modalTextSecondary: '...',
      // profileAction: '...',
      // profileActionHover: '...',
      // profileForeground: '...',
      // selectedOptionBorder: '...',
      // standby: '...',
    },
  }

  const _lightTheme = merge(lightTheme(), {
    ...sharedConfig,
  } as Theme)

  const _darkTheme = merge(darkTheme(), {
    ...sharedConfig,
  } as Theme)

  const customTheme = colorMode === 'dark' ? _darkTheme : _lightTheme

  return (
    <ReactQueryClientProvider>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider theme={customTheme} avatar={CustomAvatar}>
          <UserAccountProvider>
            <UserSettingsProvider
              initCurrency={undefined}
              initSlippage={undefined}
              initEnableSignatures={undefined}
              initPoolListView={undefined}
              initAcceptedPolicies={undefined}
            >
              {children}
              <BlockedAddressModal />
              <AcceptPoliciesModal />
            </UserSettingsProvider>
          </UserAccountProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </ReactQueryClientProvider>
  )
}
