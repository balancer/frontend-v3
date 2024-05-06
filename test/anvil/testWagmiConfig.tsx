import {
  NetworksWithFork,
  alternativeTestUserAccount,
  defaultTestUserAccount,
  getTestRpcSetup,
} from '@/test/anvil/anvil-setup'
import { Chain, http } from 'viem'
import { mainnet, polygon } from 'viem/chains'
import { createConfig } from 'wagmi'
import { mock } from 'wagmi/connectors'

export const mainnetTest = {
  ...mainnet,
  ...getTestRpcUrls('Ethereum'),
} as const satisfies Chain

export const polygonTest = {
  ...polygon,
  ...getTestRpcUrls('Polygon'),
} as const satisfies Chain

export const testChains = [mainnetTest, polygonTest]

function getTestRpcUrls(networkName: NetworksWithFork) {
  const { port, rpcUrl } = getTestRpcSetup(networkName)
  return {
    port,
    rpcUrls: {
      // These rpc urls are automatically used in the transports.
      default: {
        http: [rpcUrl],
      },
      public: {
        http: [rpcUrl],
      },
    },
  } as const
}

export const testWagmiConfig = createConfig({
  chains: [mainnetTest, polygonTest],
  connectors: [
    mock({ accounts: [defaultTestUserAccount] }),
    mock({ accounts: [alternativeTestUserAccount] }),
  ],
  pollingInterval: 100,
  storage: null,
  transports: {
    [mainnetTest.id]: http(),
    [polygonTest.id]: http(),
  },
  ssr: false,
})
