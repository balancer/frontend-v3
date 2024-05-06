import { testWagmiConfig } from '@/test/anvil/testWagmiConfig'
import { publicActions, testActions, walletActions } from 'viem'
import { mainnet, polygon } from 'viem/chains'

export function createTestHttpClient(chainId: 1 | 137) {
  return testWagmiConfig
    .getClient({ chainId })
    .extend(testActions({ mode: 'anvil' }))
    .extend(publicActions)
    .extend(walletActions)
}

export const mainnetTestPublicClient = createTestHttpClient(mainnet.id)
export const polygonTestPublicClient = createTestHttpClient(polygon.id)
