import { supportedChains } from '@/lib/modules/web3/Web3Provider'
import { MockConnector } from '@wagmi/core/connectors/mock'
import { createPublicClient, createWalletClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { Connector, CreateConfigParameters, WalletClient, createConfig } from 'wagmi'
import { testQueryClient } from './react-query'

export function createHttpClient(httpRpc: string) {
  const publicClient = createPublicClient({
    batch: {
      multicall: { batchSize: 4096 }, // change depending on chain (some have limits)
    },
    // TODO: improve client to work with other different networks
    chain: mainnet,
    transport: http(httpRpc),
  })
  return Object.assign(publicClient, {
    chains: supportedChains,
  })
}

const testRpcUrl = process.env.VITE_TEST_RPC || 'http://127.0.0.1:8555'

export const testPublicClient = createHttpClient(testRpcUrl)

export const addressRegex = /^0x[a-fA-F0-9]{40}/

export const getMockWalletClient = () =>
  createWalletClient({
    transport: http(testRpcUrl),
    chain: mainnet,
    account: '0xba100000625a3754423978a60c9317c58a424e3d',
    key: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    pollingInterval: 1_000,
  })

type SetupClient = Partial<CreateConfigParameters> & {
  walletClient?: WalletClient
}
export const mainnetMockConnector = new MockConnector({
  options: {
    flags: {
      isAuthorized: true,
      failConnect: false,
    },
    walletClient: getMockWalletClient(),
  },
})
export function createWagmiTestConfig({ ...config }: SetupClient = {}) {
  return createConfig({
    autoConnect: true,
    connectors: [mainnetMockConnector as unknown as Connector],
    publicClient: testPublicClient,
    queryClient: testQueryClient,
    ...config,
  })
}
