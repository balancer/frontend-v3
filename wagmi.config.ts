import { defineConfig, loadEnv } from '@wagmi/cli'
import { etherscan } from '@wagmi/cli/plugins'
// import { react } from '@wagmi/cli/plugins'
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
      // react(),
      etherscan({
        apiKey: env.ETHERSCAN_API_KEY,
        chainId: 1,
        contracts: [
          {
            name: 'VaultV2',
            address: mainnetNetworkConfig.contracts.balancer.vaultV2,
          },
        ],
      }),
    ],
  }
})
