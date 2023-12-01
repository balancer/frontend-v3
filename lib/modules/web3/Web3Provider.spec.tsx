import { mainnet } from 'wagmi'
import { getDefaultRpcUrl } from './Web3Provider'
import { optimism } from 'viem/chains'

test('getRpcUrl by chain id', () => {
  expect(getDefaultRpcUrl(mainnet.id)).toMatch('https://mainnet.infura.io/v3/')
  expect(getDefaultRpcUrl(optimism.id)).toMatch('https://optimism-mainnet.infura.io/')
})
