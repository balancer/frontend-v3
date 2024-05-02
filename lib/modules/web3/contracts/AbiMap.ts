import { FeeDistributorStaticAbi } from './abi/FeeDistributorStaticAbi'
import { LiquidityGaugeAbi } from './abi/LiquidityGaugeAbi'
import {
  balancerFeeDistributorAbi,
  balancerMinterAbi,
  balancerV2BalancerRelayerAbi,
  balancerV2GaugeV5Abi,
  balancerV2VaultAbi,
  balancerVeBalAbi,
} from './abi/generated'
import { VeDelegationProxyAbi } from './abi/veDelegationProxy'
import { VeDelegationProxyL2Abi } from './abi/veDelegationProxyL2'

export const AbiMap = {
  'balancer.vaultV2': balancerV2VaultAbi,
  'balancer.gaugeV5': balancerV2GaugeV5Abi,
  'balancer.minter': balancerMinterAbi,
  'balancer.relayerV6': balancerV2BalancerRelayerAbi,
  'balancer.feeDistributorStatic': FeeDistributorStaticAbi,
  'balancer.feeDistributor': balancerFeeDistributorAbi,
  'balancer.veDelegationProxy': VeDelegationProxyAbi,
  'balancer.veDelegationProxyL2': VeDelegationProxyL2Abi,
  'balancer.veBAL': balancerVeBalAbi,
  'balancer.LiquidityGauge': LiquidityGaugeAbi,
}

export type AbiMapType = keyof typeof AbiMap | undefined
