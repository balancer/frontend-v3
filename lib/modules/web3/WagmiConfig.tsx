'use client'

import { Chain, connectorsForWallets } from '@rainbow-me/rainbowkit'

import { createConfig, fallback, http } from 'wagmi'

import { getGqlChain } from '@/lib/config/app.config'
import { SupportedChainId } from '@/lib/config/config.types'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { chains, rpcOverrides } from './ChainConfig'

function getTransports(chain: Chain) {
  const gqlChain = getGqlChain(chain.id as SupportedChainId)
  const overrideRpcUrl = rpcOverrides[gqlChain]
  const fallbackRpcUrl = rpcOverrides[gqlChain]
  return fallback([http(overrideRpcUrl), http(), http(fallbackRpcUrl)])
}

const transports = Object.fromEntries(
  chains.map(chain => [chain.id, getTransports(chain)])
) as Record<number, ReturnType<typeof getTransports>>

const appName = getProjectConfig().projectName
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || ''
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        injectedWallet,
        metaMaskWallet,
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
  connectors,
  ssr: true,
})
