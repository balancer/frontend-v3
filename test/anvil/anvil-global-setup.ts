import { ANVIL_NETWORKS, getForkUrl } from './anvil-setup'

export async function setup() {
  // Show verbose warnings once:
  const verbose = true
  getForkUrl(ANVIL_NETWORKS['MAINNET'], verbose)
  getForkUrl(ANVIL_NETWORKS['POLYGON'], verbose)
}

export async function teardown() {
  // pkill -f "anvil --fork-url"
}
