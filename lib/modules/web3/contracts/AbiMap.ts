import { FeeDistributorABI } from './abi/FeeDistributorABI'
import { FeeDistributorStaticABI } from './abi/FeeDistributorStaticABI'
import {
  balancerMinterABI,
  balancerV2BalancerRelayerABI,
  balancerV2GaugeV5ABI,
  balancerV2VaultABI,
} from './abi/generated'

export const AbiMap = {
  'balancer.vaultV2': balancerV2VaultABI,
  'balancer.gaugeV5': balancerV2GaugeV5ABI,
  'balancer.minter': balancerMinterABI,
  'balancer.relayerV6': balancerV2BalancerRelayerABI,
  'balancer.feeDistributorStatic': FeeDistributorStaticABI,
  'balancer.feeDistributor': FeeDistributorABI,
}

export type AbiMapType = keyof typeof AbiMap | undefined
