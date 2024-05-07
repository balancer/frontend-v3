import { Anvil, createAnvil } from '@viem/anvil'

import { ANVIL_NETWORKS, getForkUrl } from './anvil-setup'
import { testChains } from './testWagmiConfig'

export async function setup() {
  const promises = []
  const results: Anvil[] = []
  for (const chain of Object.values(testChains)) {
    console.log('Starting anvil ', {
      port: chain.port,
      forkUrl: getForkUrl(ANVIL_NETWORKS[chain.name], true),
      forkBlockNumber: ANVIL_NETWORKS[chain.name].forkBlockNumber,
    })
    const anvil = createAnvil({
      port: chain.port,
      host: '::',
      chainId: chain.id,
      forkUrl: getForkUrl(ANVIL_NETWORKS[chain.name], true),
      forkBlockNumber: ANVIL_NETWORKS[chain.name].forkBlockNumber,
      noMining: false,
    })
    results.push(anvil)
    promises.push(anvil.start())
  }
  await Promise.all(promises)
  return

  return () => {
    for (const result of results) {
      result.stop()
    }
  }
}
