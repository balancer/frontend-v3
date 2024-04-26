import { getChainId, getNetworkConfig } from '@/lib/config/app.config'
import { getDefaultRpcUrl } from '@/lib/modules/web3/Web3Provider'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Hex } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet, polygon, fantom } from 'viem/chains'

export type NetworksWithFork = 'MAINNET' | 'POLYGON'

export type NetworkSetup = {
  networkName: NetworksWithFork
  fallBackRpc: string | undefined
  port: number
  forkBlockNumber: bigint
}

export const defaultAnvilTestPrivateKey =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

// anvil account address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
export const defaultTestUserAccount = privateKeyToAccount(defaultAnvilTestPrivateKey as Hex).address

type viemChainsWithFork = typeof mainnet | typeof polygon
export const chainsByNetworkName: Record<NetworksWithFork, viemChainsWithFork> = {
  MAINNET: mainnet,
  POLYGON: polygon,
}

const ANVIL_PORTS: Record<NetworksWithFork, number> = {
  //Ports separated by 100 to avoid port collision when running tests in parallel
  MAINNET: 8645,
  POLYGON: 8745,
}

export const ANVIL_NETWORKS: Record<NetworksWithFork, NetworkSetup> = {
  MAINNET: {
    networkName: 'MAINNET',
    fallBackRpc: getDefaultRpcUrl(getChainId(GqlChain.Polygon)),
    port: ANVIL_PORTS.MAINNET,
    // From time to time this block gets outdated having this kind of error in integration tests:
    // ContractFunctionExecutionError: The contract function "queryJoin" returned no data ("0x").
    forkBlockNumber: 18936208n,
  },
  POLYGON: {
    networkName: 'POLYGON',
    fallBackRpc: getDefaultRpcUrl(getChainId(GqlChain.Polygon)),
    port: ANVIL_PORTS.POLYGON,
    // Note - this has to be >= highest blockNo used in tests
    forkBlockNumber: 44215395n,
  },
}

export function getPort(network: NetworkSetup) {
  return network.port + (Number(process.env.VITEST_WORKER_ID) || 0)
}

export function getTestRpcUrl(networkName: NetworksWithFork) {
  const network = ANVIL_NETWORKS[networkName]

  const port = getPort(network)

  return `http://127.0.0.1:${port}`
}

export function getForkUrl(network: NetworkSetup, verbose = false): string {
  if (network.networkName === 'MAINNET' && process.env['PRIVATE_INFURA_KEY']) {
    return `https://mainnet.infura.io/v3/${process.env['PRIVATE_INFURA_KEY']}`
  } else {
    if (!network.fallBackRpc) {
      throw Error(`Please add a fallback RPC for ${network.networkName} network.`)
    }

    if (verbose) {
      console.warn(`Falling back to \`${network.fallBackRpc}\`.`)
    }
    return network.fallBackRpc
  }
}
