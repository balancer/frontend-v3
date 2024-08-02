'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { ConnectKitProvider } from 'connectkit'
import { PropsWithChildren } from 'react'
import { RainbowProvider } from './RainbowProvider'
import { WagmiConfig } from './WagmiConfigConnectKit'
import { wagmiConfigRainbow } from './WagmiConfigRainbow'

function isRainbowConfig(wagmiConfig: WagmiConfig) {
  return wagmiConfig === wagmiConfigRainbow
}

type Props = {
  wagmiConfig: WagmiConfig
}
export function WalletConnectionProvider({ children, wagmiConfig }: PropsWithChildren<Props>) {
  if (isRainbowConfig(wagmiConfig)) return <RainbowProvider>{children}</RainbowProvider>

  return <ConnectKitProvider>{children}</ConnectKitProvider>
}
