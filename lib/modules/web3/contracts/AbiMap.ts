import { FeeDistributorABI } from './abi/FeeDistributorABI'
import { FeeDistributorStaticABI } from './abi/FeeDistributorStaticABI'
import { LiquidityGaugeABI } from './abi/LiquidityGaugeABI'
import {
  balancerMinterABI,
  balancerV2BalancerRelayerABI,
  balancerV2GaugeV5ABI,
  balancerV2VaultABI,
} from './abi/generated'
import { VeBALABI } from './abi/veBalABI'
import { VeDelegationProxyABI } from './abi/veDelegationProxy'
import { VeDelegationProxyL2ABI } from './abi/veDelegationProxyL2'

export const AbiMap = {
  'balancer.vaultV2': balancerV2VaultABI,
  'balancer.gaugeV5': balancerV2GaugeV5ABI,
  'balancer.minter': balancerMinterABI,
  'balancer.relayerV6': balancerV2BalancerRelayerABI,
  'balancer.feeDistributorStatic': FeeDistributorStaticABI,
  'balancer.feeDistributor': FeeDistributorABI,
  'balancer.veDelegationProxy': VeDelegationProxyABI,
  'balancer.veDelegationProxyL2': VeDelegationProxyL2ABI,
  'balancer.veBAL': VeBALABI,
  'balancer.LiquidityGauge': LiquidityGaugeABI,
}

export type AbiMapType = keyof typeof AbiMap | undefined
