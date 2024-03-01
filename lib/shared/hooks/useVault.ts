import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { VaultVersion } from '../types'
import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'

export type VaultVersion = 2 | 3

export function useVault(version: VaultVersion | number) {
  const vaultV2Address = useContractAddress('balancer.vaultV2')
  const vaultV3Address = emptyAddress
  const vaultAddress = version === 3 ? vaultV3Address : vaultV2Address

  return {
    vaultAddress,
  }
}
