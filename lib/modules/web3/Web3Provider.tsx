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
  mainnet,
  polygon,
  optimism,
  arbitrum,
  polygonZkEvm,
  gnosis,
} from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { infuraProvider } from 'wagmi/providers/infura'
import { merge } from 'lodash'
import { useEffect, useState } from 'react'
import { theme, ThemeTypings, useColorMode, useTheme } from '@chakra-ui/react'
import { balTheme } from '@/lib/services/chakra/theme'

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, polygonZkEvm, gnosis],
  [
    alchemyProvider({ apiKey: 'VBeQgTCRqqPtuuEPsFzRdwKXzDyN6aFh' }),
    infuraProvider({ apiKey: 'daaa68ec242643719749dd1caba2fc66' }),
    publicProvider(),
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'Balancer',
  projectId: '1b6b722470b504a53cf011e1e629a9eb', // WalletConnect Cloud ID
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme<ThemeTypings>()
  console.log('colors', colors)

  const sharedConfig = {
    fonts: {
      body: balTheme.fonts?.body,
    },
    radii: {
      // connectButton: twConfig.theme?.borderRadius?.md,
      // actionButton: twConfig.theme?.borderRadius?.md,
      // menuButton: twConfig.theme?.borderRadius?.md,
      // modal: twConfig.theme?.borderRadius?.md,
      // modalMobile: twConfig.theme?.borderRadius?.md,
    },
    shadows: {
      // connectButton: twConfig.theme?.boxShadow?.md,
      // dialog: twConfig.theme?.boxShadow?.xl,
      // profileDetailsAction: twConfig.theme?.boxShadow?.md,
      // selectedOption: twConfig.theme?.boxShadow?.md,
      // selectedWallet: twConfig.theme?.boxShadow?.md,
      // walletLogo: twConfig.theme?.boxShadow?.md,
    },
    colors: {
      accentColor: colors.primary[500],
      // accentColorForeground: (twConfig.theme?.colors?.primary as TwColor)
      //   .foreground,
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
  const [customTheme, setCustomTheme] = useState(_lightTheme)

  useEffect(() => {
    if (colorMode === 'dark') {
      setCustomTheme(_darkTheme)
    } else {
      setCustomTheme(_lightTheme)
    }
  }, [colorMode, _lightTheme, _darkTheme])

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={customTheme}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
