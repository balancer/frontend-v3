import { chainsByKey } from '@/lib/modules/web3/Web3Provider'
import { CreateConfigParameters, WalletClient, createConfig } from 'wagmi'
import { testQueryClient } from '../react-query'
import { createMockConnector } from './wagmi-mock-connectors'
import { createTestHttpClient } from './wagmi-test-clients'
import { ChainId } from '@balancer/sdk'
import { NetworksWithFork, getTestRpcUrl } from '../../anvil/anvil-setup'

/*
  TODO: this won't be needed in wagmi v2
  because createConfig supports multiple chains and transports:
  https://wagmi.sh/core/api/createConfig#chains
  https://wagmi.sh/core/api/createConfig#transports
*/
export let currentTestNetwork: NetworksWithFork = 'MAINNET'

export function setCurrentTestNetwork(networkName: NetworksWithFork) {
  currentTestNetwork = networkName
}

export const testPublicClient = createTestHttpClient(currentTestNetwork)

type SetupClient = Partial<CreateConfigParameters> & {
  walletClient?: WalletClient
}

export function createWagmiTestConfig({ ...config }: SetupClient = {}) {
  return createConfig({
    autoConnect: true,
    connectors: [createMockConnector(currentTestNetwork)],
    publicClient: createTestHttpClient(currentTestNetwork),
    queryClient: testQueryClient,
    ...config,
  })
}

export function setWagmiDefaultRpcUrlForTests() {
  // chainsByKey variable is returned by configureChains in Web3Provider
  // We override the default http urls
  // This will change in wagmi v2 setup
  const chainId = ChainId[currentTestNetwork]

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  chainsByKey[chainId].rpcUrls.default.http[0] = getTestRpcUrl(currentTestNetwork)
}
