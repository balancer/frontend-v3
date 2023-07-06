'use client'

import '@rainbow-me/rainbowkit/styles.css'

import {
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

const customTheme = merge(lightTheme(), {
  fonts: {
    body: 'Inter, sans-serif',
  },
} as Theme)

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={customTheme}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
