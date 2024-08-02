'use client'

import { useThemeColorMode } from '@/lib/shared/services/chakra/useThemeColorMode'
import { useTheme } from '@chakra-ui/react'
import { RainbowKitProvider, Theme, darkTheme, lightTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { merge } from 'lodash'
import { PropsWithChildren } from 'react'
import { CustomAvatar } from './connect-button/CustomAvatar'

export function RainbowProvider({ children }: PropsWithChildren) {
  const { colors, radii, shadows, semanticTokens, fonts } = useTheme()
  const colorMode = useThemeColorMode()
  const colorModeKey = colorMode === 'light' ? 'default' : '_dark'

  const sharedConfig = {
    fonts: {
      body: fonts.body,
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
    <RainbowKitProvider theme={customTheme} avatar={CustomAvatar}>
      {children}
    </RainbowKitProvider>
  )
}
