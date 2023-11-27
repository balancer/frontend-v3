import { supportedChains } from '@/lib/modules/web3/Web3Provider'
import { MockConnector } from 'wagmi/connectors/mock'
import {
  Hex,
  createClient,
  createWalletClient,
  http,
  publicActions,
  testActions,
  walletActions,
} from 'viem'
import { mainnet } from 'viem/chains'
import { CreateConfigParameters, WalletClient, createConfig } from 'wagmi'
import { testQueryClient } from './react-query'
import { privateKeyToAccount } from 'viem/accounts'

const defaultAnvilTestPrivateKey =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

export const defaultTestUserAccount = privateKeyToAccount(defaultAnvilTestPrivateKey as Hex).address

function createTestHttpClient(httpRpc: string) {
  const testClient = createClient({
    batch: {
      multicall: { batchSize: 4096 }, // change depending on chain (some have limits)
    },
    // TODO: improve client to work with other different networks
    chain: mainnet,
    // account: defaultTestUserAccount,
    transport: http(httpRpc),
  })
    .extend(testActions({ mode: 'anvil' }))
    .extend(publicActions)
    .extend(walletActions)

  return Object.assign(testClient, {
    chains: supportedChains,
  })
}

const testRpcUrl = process.env.VITE_TEST_RPC || 'http://127.0.0.1:8555'

export const testPublicClient = createTestHttpClient(testRpcUrl)

export const getMockWalletClient = () =>
  createWalletClient({
    transport: http(testRpcUrl),
    chain: mainnet,
    account: defaultTestUserAccount,
    key: defaultAnvilTestPrivateKey,
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
    connectors: [mainnetMockConnector],
    publicClient: testPublicClient,
    queryClient: testQueryClient,
    ...config,
  })
}
