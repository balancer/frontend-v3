import mainnetNetworkConfig from '@/lib/config/networks/mainnet'
import { Address } from 'viem'

/*
  Temporary shared helpers and constants used by debug pages until we finish the real implementations (depending on SDK and other blocking parts)
*/
export const wETHAddress: Address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
export const wjAuraAddress: Address = '0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f' as Address

export const vaultV2Address = mainnetNetworkConfig.contracts.balancer.vaultV2 as Address

export const poolId: Address = '0x68e3266c9c8bbd44ad9dca5afbfe629022aee9fe000200000000000000000512' // Balancer Weighted wjAura and WETH
