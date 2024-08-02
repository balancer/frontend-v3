'use client'

import { createConfig } from 'wagmi'

import { getDefaultConfig } from 'connectkit'

import { getProjectConfig } from '@/lib/config/getProjectConfig'

import { injected, metaMask, safe } from 'wagmi/connectors'
import { chains } from './ChainConfig'
import { transports } from './transports'

const appName = getProjectConfig().projectName
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || ''

export type WagmiConfig = ReturnType<typeof createConfig>

const connectors = [
  injected(),
  metaMask(),
  safe(),
  // walletConnect({ projectId })
]

export const wagmiConfigConnectKit = createConfig(
  getDefaultConfig({
    chains,
    transports,
    connectors,
    walletConnectProjectId: projectId,
    appName,

    // Optional App Info
    appDescription: 'Balancer',
    appUrl: 'https://balancer.fi',
    // appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
    ssr: true,
  })
)
