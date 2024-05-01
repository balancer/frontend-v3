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
import { getProjectConfig, PROJECT_CONFIG } from '@/lib/config/getProjectConfig'
import { UserAccountProvider } from './useUserAccount'
import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'
import { BlockedAddressModal } from './BlockedAddressModal'
import { AcceptPoliciesModal } from './AcceptPoliciesModal'
import { UserSettingsProvider } from '../user/settings/useUserSettings'
import { ReactQueryClientProvider } from '@/app/react-query.provider'
import { balancerSupportedChains } from '@/lib/config/projects/balancer'
import { beetsSupportedChains } from '@/lib/config/projects/beets'

// We need this type to satisfy "chains" type in RainbowKit's getDefaultConfig
type ProjectSupportedChain = typeof balancerSupportedChains | typeof beetsSupportedChains
type SupportedChain = (typeof supportedChains)[number]
type SupportedChainId = (typeof supportedChains)[number]['id']
export const supportedChains = PROJECT_CONFIG.supportedChains

// Helpful for injecting fork RPCs for specific chains.
const rpcOverrides: Record<SupportedChainId, string | undefined> = {
  [mainnet.id]: undefined,
  [arbitrum.id]: undefined,
  [base.id]: undefined,
  [avalanche.id]: undefined,
  [gnosis.id]: undefined,
  [fantom.id]: undefined,
  [optimism.id]: undefined,
  [polygon.id]: undefined,
  [polygonZkEvm.id]: undefined,
  [sepolia.id]: undefined,
}

export const chainsByKey = keyBy(balancerSupportedChains, 'id')

export function getDefaultRpcUrl(chainId: SupportedChainId) {
  return chainsByKey[chainId].rpcUrls.default.http[0]
}

// TODO: define public urls as fallback??
function getTransports(chain: SupportedChain) {
  const overridenRpcUrl = rpcOverrides[chain.id]

  return fallback([
    http(overridenRpcUrl),
    http(), // Public transport as first option
  ])
}

export const wagmiConfig = getDefaultConfig({
  appName: getProjectConfig().projectName,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string,
  chains: supportedChains as ProjectSupportedChain,
  transports: {
    [mainnet.id]: getTransports(mainnet),
    [arbitrum.id]: getTransports(arbitrum),
    [base.id]: getTransports(base),
    [avalanche.id]: getTransports(avalanche),
    [gnosis.id]: getTransports(gnosis),
    [optimism.id]: getTransports(optimism),
    [polygon.id]: getTransports(polygon),
    [polygonZkEvm.id]: getTransports(polygonZkEvm),
    [sepolia.id]: getTransports(sepolia),
  },
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
