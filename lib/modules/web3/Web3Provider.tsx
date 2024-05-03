'use client'

import '@rainbow-me/rainbowkit/styles.css'

import {
  darkTheme,
  getDefaultConfig,
  lightTheme,
  RainbowKitProvider,
  Theme,
} from '@rainbow-me/rainbowkit'

import { WagmiProvider, http, fallback } from 'wagmi'

import {
  arbitrum,
  avalanche,
  base,
  Chain,
  fantom,
  gnosis,
  mainnet,
  optimism,
  polygon,
  polygonZkEvm,
  sepolia,
} from 'viem/chains'

import { keyBy, merge } from 'lodash'
import { useTheme } from '@chakra-ui/react'
import { balTheme } from '@/lib/shared/services/chakra/theme'
import { CustomAvatar } from './CustomAvatar'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { UserAccountProvider } from './useUserAccount'
import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'
import { BlockedAddressModal } from './BlockedAddressModal'
import { AcceptPoliciesModal } from './AcceptPoliciesModal'
import { UserSettingsProvider } from '../user/settings/useUserSettings'
import { ReactQueryClientProvider } from '@/app/react-query.provider'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { getGqlChain } from '@/lib/config/app.config'
import { _chains } from '@rainbow-me/rainbowkit/dist/config/getDefaultConfig'
import { SupportedChainId } from '@/lib/config/config.types'

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
  [GqlChain.Mainnet]: mainnet,
  [GqlChain.Arbitrum]: arbitrum,
  [GqlChain.Base]: base,
  [GqlChain.Avalanche]: avalanche,
  [GqlChain.Fantom]: fantom,
  [GqlChain.Gnosis]: gnosis,
  [GqlChain.Optimism]: optimism,
  [GqlChain.Polygon]: polygon,
  [GqlChain.Zkevm]: polygonZkEvm,
  [GqlChain.Sepolia]: sepolia,
} as const satisfies Record<GqlChain, Chain>

export const supportedNetworks = getProjectConfig().supportedNetworks
export const supportedChains: Chain[] = supportedNetworks.map(
  gqlChain => gqlChainToWagmiChainMap[gqlChain]
)

const chainsByKey = keyBy(supportedChains, 'id')
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
  supportedChains.map(chain => [chain.id, getTransports(chain)])
) as Record<number, ReturnType<typeof getTransports>>

export const wagmiConfig = getDefaultConfig({
  appName: getProjectConfig().projectName,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string,
  chains: supportedChains as unknown as _chains,
  transports,
  ssr: true,
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const { colors, radii, shadows } = useTheme()

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
      accentColor: colors.primary[500],
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
      // modalBackground: '...',
      // modalBorder: '...',
      // modalText: '...',
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

  const colorMode = useThemeColorMode()
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
