import { supportedChains } from '@/lib/modules/web3/Web3Provider'
import { createClient, http, publicActions, testActions, walletActions } from 'viem'
import { NetworksWithFork, chainsByNetworkName, getTestRpcUrl } from '../../anvil/anvil-setup'

export function createTestHttpClient(networkName: NetworksWithFork) {
  const testClient = createClient({
    batch: {
      multicall: { batchSize: 4096 }, // change depending on chain (some have limits)
    },
    chain: chainsByNetworkName[networkName],
    transport: http(getTestRpcUrl(networkName)),
  })
    .extend(testActions({ mode: 'anvil' }))
    .extend(publicActions)
    .extend(walletActions)

  return Object.assign(testClient, {
    chains: supportedChains,
  })
}
