import { defineConfig, loadEnv } from '@wagmi/cli'
import { etherscan, react } from '@wagmi/cli/plugins'
import mainnetNetworkConfig from './lib/config/networks/mainnet'

import { erc20ABI } from 'wagmi'

const CONTRACTS: Array<{ name: string; abi: any }> = [
  {
    name: 'erc20',
    abi: erc20ABI,
  },
]

export default defineConfig(() => {
  const env = loadEnv({
    mode: process.env.NODE_ENV,
    envDir: process.cwd(),
  })

  return {
    out: 'lib/modules/web3/contracts/abi/generated.ts',
    contracts: CONTRACTS,
    plugins: [
      react({
        useContractRead: true,
        useContractFunctionRead: false,
        useContractWrite: false,
        useContractFunctionWrite: false,
        usePrepareContractWrite: false,
        usePrepareContractFunctionWrite: false,
        useContractItemEvent: false,
        useContractEvent: false,
      }),
      etherscan({
        apiKey: env.ETHERSCAN_API_KEY,
        chainId: 1,
        contracts: [
          {
            name: 'BalancerV2Vault',
            address: mainnetNetworkConfig.contracts.balancer.vaultV2,
          },
          {
            name: 'BalancerV2ComposableStablePoolV5',
            address: '0xdacf5fa19b1f720111609043ac67a9818262850c',
          },
          {
            name: 'BalancerV2ERC4626LinearPoolV3',
            address: '0x6667c6fa9f2b3fc1cc8d85320b62703d938e4385',
          },
          {
            name: 'BalancerV2WeightedPoolV4',
            address: '0x3ff3a210e57cfe679d9ad1e9ba6453a716c56a2e',
          },
          {
            name: 'BalancerV2GaugeV5',
            address: '0xbc02ef87f4e15ef78a571f3b2adcc726fee70d8b',
          },
          {
            name: 'BalancerV2BatchRelayerLibrary',
            address: '0xea66501df1a00261e3bb79d1e90444fc6a186b62',
          },
          { name: 'BalancerMinter', address: '0x239e55F427D44C3cc793f49bFB507ebe76638a2b' },
          {
            name: 'BalancerV2BalancerRelayer',
            address: '0x35Cea9e57A393ac66Aaa7E25C391D52C74B5648f',
          },
        ],
      }),
    ],
  }
})
