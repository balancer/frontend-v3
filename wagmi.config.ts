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
        ],
      }),
    ],
  }
})
