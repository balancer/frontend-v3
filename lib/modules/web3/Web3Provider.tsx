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
import { twConfig } from '@/lib/utils/styles'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

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

const _lightTheme = merge(lightTheme(), {
  fonts: {
    body: (twConfig.theme?.fontFamily?.sans as string[]).join(', '),
  },
} as Theme)

const _darkTheme = merge(darkTheme(), {
  fonts: {
    body: (twConfig.theme?.fontFamily?.sans as string[]).join(', '),
  },
} as Theme)

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const [customTheme, setCustomTheme] = useState(_lightTheme)

  useEffect(() => {
    if (theme === 'dark') {
      setCustomTheme(_darkTheme)
    } else {
      setCustomTheme(_lightTheme)
    }
  }, [theme])

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={customTheme}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
