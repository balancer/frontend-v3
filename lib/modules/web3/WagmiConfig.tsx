'use client'

import { connectorsForWallets } from '@rainbow-me/rainbowkit'

import { createConfig } from 'wagmi'

import { getProjectConfig } from '@/lib/config/getProjectConfig'
import {
  coinbaseWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { chains } from './ChainConfig'
import { transports } from './transports'
import { injected, metaMask } from 'wagmi/connectors'

const appName = getProjectConfig().projectName
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || ''
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        // injectedWallet,
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
export type WagmiConfig = ReturnType<typeof createConfig>
export const wagmiConfig = createConfig({
  chains,
  transports,
  /*
    We found random disconnection issues when using metaMaskWallet from @rainbow-me/rainbowkit/wallets
    Using default wagmi metaMask connector instead, seems to be more reliable:
  */
  connectors: [
    injected(),
    metaMask({ shouldShimWeb3: true, dappMetadata: { name: appName } }),
    ...connectors,
  ],
  ssr: true,
})
