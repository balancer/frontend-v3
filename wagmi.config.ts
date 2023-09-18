import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'

import { erc20ABI } from 'wagmi'
import VaultABI from '@/abi/Vault.json'

const CONTRACTS: Array<{ name: string; abi: any }> = [
  {
    name: 'erc20',
    abi: erc20ABI,
  },
  {
    name: 'vault',
    abi: VaultABI,
  },
]

export default defineConfig({
  out: 'lib/abi/generated.ts',
  contracts: CONTRACTS,
  plugins: [react()],
})
