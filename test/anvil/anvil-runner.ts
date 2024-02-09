import { CreateAnvilOptions, createAnvil } from '@viem/anvil'
import { sleep } from '@/lib/shared/utils/time'
import { ensureError } from '@/lib/shared/utils/errors'
import {
  setCurrentTestNetwork,
  setWagmiDefaultRpcUrlForTests,
} from '../utils/wagmi/wagmi-test-setup'
import {
  ANVIL_NETWORKS,
  NetworkSetup,
  NetworksWithFork,
  getForkUrl,
  getPort,
  getTestRpcUrl,
} from './anvil-setup'

type Options = {
  blockNumber?: bigint // If not provided, the fork will start from the network's forkBlockNumber
  verbose?: boolean
}

function getAnvilOptions(
  network: NetworkSetup,
  { blockNumber, verbose = false }: Options
): CreateAnvilOptions {
  const port = getPort(network)
  const forkBlockNumber = blockNumber ?? network.forkBlockNumber
  return {
    forkUrl: getForkUrl(network, verbose),
    port,
    forkBlockNumber,
  }
}

/*
    Starts an anvil fork with the given options.
    In vitest, each thread is assigned a unique, numerical id (`process.env.WORKER_JOB_ID`).
    When jobId is provided, the fork uses this id to create a different local rpc url (e.g. `http://127.0.0.1:<8545+jobId>/`
    so that tests can be run in parallel (depending on the number of threads of the host machine)
*/
export async function startFork(
  networkName: NetworksWithFork,
  { blockNumber, verbose = false }: Options = {}
) {
  setCurrentTestNetwork(networkName)
  setWagmiDefaultRpcUrlForTests()

  const network = ANVIL_NETWORKS[networkName]
  const anvilOptions = getAnvilOptions(network, { blockNumber, verbose })
  // https://www.npmjs.com/package/@viem/anvil
  const anvil = createAnvil(anvilOptions)

  const port = anvilOptions.port
  if (!port) throw new Error('anvil port should be defined')

  if (process.env.SKIP_GLOBAL_SETUP === 'true') {
    console.warn(`🛠️  Skipping global anvil setup. You must run the anvil fork manually. Example:
anvil --fork-url https://eth-mainnet.alchemyapi.io/v2/<your-key> --port 8545 --fork-block-number=17878719
`)
    await sleep(5000)
    return { rpcUrl: 'http://127.0.0.1:8545' }
  }

  const rpcUrl = getTestRpcUrl(networkName)

  // if (verbose) {
  console.log('🛠️  Starting anvil', {
    networkName,
    port,
    forkBlockNumber: blockNumber ?? anvilOptions.forkBlockNumber,
  })
  // }
  try {
    await anvil.start()
  } catch (e) {
    const error = ensureError(e)
    // Ignore error when anvil was already running in the same port as the test should pass anyways
    if (!error.message.includes('Address already in use')) throw e
  }
  return {
    rpcUrl,
  }
}
