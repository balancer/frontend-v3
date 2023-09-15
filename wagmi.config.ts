import { defineConfig } from '@wagmi/cli'

import ERC20ABI from '@/abi/ERC20.json'
import VaultABI from '@/abi/Vault.json'

const CONTRACTS: Array<{ name: string; abi: any }> = [
  {
    name: 'erc20',
    abi: ERC20ABI,
  },
  {
    name: 'vault',
    abi: VaultABI,
  },
]

export default defineConfig({
  out: 'lib/abi/generated.ts',
  contracts: CONTRACTS,
  plugins: [],
})
