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
import { arbitrum, gnosis, mainnet, optimism, polygon, polygonZkEvm } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { infuraProvider } from 'wagmi/providers/infura'
import { merge } from 'lodash'
import { useColorMode, useTheme } from '@chakra-ui/react'
import { balTheme } from '@/lib/services/chakra/theme'
import { CustomAvatar } from './CustomAvatar'

export const supportedChains = [mainnet, polygon, optimism, arbitrum, polygonZkEvm, gnosis]

const { chains, publicClient } = configureChains(supportedChains, [
  infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY as string }),
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string }),
  publicProvider(),
])

export const { connectors } = getDefaultWallets({
  appName: 'Balancer',
  projectId: '1b6b722470b504a53cf011e1e629a9eb', // WalletConnect Cloud ID
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

  const { colorMode } = useColorMode()
  const customTheme = colorMode === 'dark' ? _darkTheme : _lightTheme

  return (
    <WagmiConfig config={createWagmiConfig()}>
      <RainbowKitProvider chains={chains} theme={customTheme} avatar={CustomAvatar}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
