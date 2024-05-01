import { getDefaultRpcUrl } from './Web3Provider'
import { mainnet, optimism } from 'viem/chains'

test('getRpcUrl by chain id', () => {
  expect(getDefaultRpcUrl(mainnet.id)).toMatch('https://cloudflare-eth.com')
  expect(getDefaultRpcUrl(optimism.id)).toMatch('https://mainnet.optimism.io')
})
