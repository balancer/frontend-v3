import { CreateAnvilOptions, createAnvil } from '@viem/anvil'
import { sleep } from '../utils/promises'

export let forkUrl: string
if (process.env.VITE_ANVIL_FORK_RPC_URL) {
  forkUrl = process.env.VITE_ANVIL_FORK_RPC_URL
} else {
  forkUrl = 'https://cloudflare-eth.com'
  console.warn(`\`VITE_ANVIL_FORK_RPC_URL\` not found. Falling back to \`${forkUrl}\`.`)
}

const port = 8555

const anvilOptions: CreateAnvilOptions = {
  forkUrl,
  port,
  // From time to time this block gets outdated having this kind of error in integration tests:
  // ContractFunctionExecutionError: The contract function "queryJoin" returned no data ("0x").
  forkBlockNumber: 18936208,
}

// https://www.npmjs.com/package/@viem/anvil
export const anvil = createAnvil(anvilOptions)

export default async function startAnvil() {
  if (process.env.VITE_SKIP_GLOBAL_SETUP === 'true') {
    console.warn(`🛠️  Skipping global anvil setup. You must run the anvil fork manually. Example:
anvil --fork-url https://eth-mainnet.alchemyapi.io/v2/<your-key> --port 8555 --fork-block-number=17878719
`)
    await sleep(5000)
    return
  }
  console.log(`🛠️  Starting anvil`, anvilOptions)
  return await anvil.start()
}
