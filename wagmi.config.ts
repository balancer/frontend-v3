import { defineConfig, loadEnv } from '@wagmi/cli'
import { etherscan } from '@wagmi/cli/plugins'
import { mainnet } from 'wagmi'
import mainnetNetworkConfig from './lib/config/networks/mainnet'

export default defineConfig(() => {
  const env = loadEnv({
    mode: process.env.NODE_ENV,
    envDir: process.cwd(),
  })

  return {
    out: 'src/generated.ts',
    contracts: [],
    plugins: [
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
