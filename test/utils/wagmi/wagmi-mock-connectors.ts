import { createWalletClient, http } from 'viem'
import { MockConnector } from 'wagmi/connectors/mock'
import { WalletClient } from 'wagmi'
import { mainnet, polygon, fantom } from 'viem/chains'
import {
  NetworksWithFork,
  defaultAnvilTestPrivateKey,
  defaultTestUserAccount,
  getTestRpcUrl,
} from '../../anvil/anvil-setup'

type viemChainsWithFork = typeof mainnet | typeof polygon | typeof fantom
const chainsByNetworkName: Record<NetworksWithFork, viemChainsWithFork> = {
  MAINNET: mainnet,
  POLYGON: polygon,
  FANTOM: fantom,
}

export function createMockConnector(networkName: NetworksWithFork): MockConnector {
  return new MockConnector({
    options: {
      flags: {
        isAuthorized: true,
        failConnect: false,
      },
      walletClient: getMockWalletClient(networkName),
    },
  })
}

export function getMockWalletClient(networkName: NetworksWithFork): WalletClient {
  return createWalletClient({
    transport: http(getTestRpcUrl(networkName)),
    chain: chainsByNetworkName[networkName],
    account: defaultTestUserAccount,
    key: defaultAnvilTestPrivateKey,
    pollingInterval: 1_000,
  })
}
