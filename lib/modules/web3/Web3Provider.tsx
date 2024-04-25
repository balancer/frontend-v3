'use client'

import '@rainbow-me/rainbowkit/styles.css'

import {
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
  Theme,
} from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
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
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { infuraProvider } from 'wagmi/providers/infura'
import { keyBy, merge } from 'lodash'
import { useTheme } from '@chakra-ui/react'
import { balTheme } from '@/lib/shared/services/chakra/theme'
import { CustomAvatar } from './CustomAvatar'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { SupportedChainId } from '@/lib/config/config.types'
import { UserAccountProvider } from './useUserAccount'
import { defineChain } from 'viem'
import { Chain } from 'viem'
import { getNetworkConfig } from '@/lib/config/app.config'
import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'
import { BlockedAddressModal } from './BlockedAddressModal'
import { AcceptPoliciesModal } from './AcceptPoliciesModal'
import { UserSettingsProvider } from '../user/settings/useUserSettings'

function buildChain(viemChain: Chain, rpcOverride?: string): Chain {
  const { rpcUrl } = getNetworkConfig(viemChain.id)

  return defineChain({
    ...viemChain,
    rpcUrls: {
      default: { http: [rpcOverride || rpcUrl, ...viemChain.rpcUrls.default.http] },
      public: { http: [rpcOverride || rpcUrl, ...viemChain.rpcUrls.public.http] },
    },
  })
}

export const supportedChains = [
  buildChain(mainnet),
  buildChain(arbitrum),
  buildChain(base),
  buildChain(avalanche),
  buildChain(fantom),
  buildChain(gnosis),
  buildChain(optimism),
  buildChain(polygon),
  buildChain(polygonZkEvm),
  buildChain(sepolia),
]

const { chains, publicClient } = configureChains(supportedChains, [
  infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY as string }),
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string }),
  publicProvider(),
])

export const chainsByKey = keyBy(chains, 'id')

export function getDefaultRpcUrl(chainId: SupportedChainId) {
  return chainsByKey[chainId].rpcUrls.default.http[0]
}

export const { connectors } = getDefaultWallets({
  appName: getProjectConfig().projectName,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID as string,
  chains,
})

export function createWagmiConfig() {
  return createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  })
}

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
    <WagmiConfig config={createWagmiConfig()}>
      <RainbowKitProvider chains={chains} theme={customTheme} avatar={CustomAvatar}>
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
    </WagmiConfig>
  )
}
