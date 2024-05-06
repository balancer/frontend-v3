import { FeeDistributorAbi } from './abi/FeeDistributorAbi'
import { FeeDistributorStaticAbi } from './abi/FeeDistributorStaticAbi'
import { LiquidityGaugeAbi } from './abi/LiquidityGaugeAbi'
import {
  balancerMinterAbi,
  balancerV2BalancerRelayerAbi,
  balancerV2GaugeV5Abi,
  balancerV2VaultAbi,
} from './abi/generated'
import { VeBALAbi } from './abi/veBalAbi'
import { VeDelegationProxyAbi } from './abi/veDelegationProxy'
import { VeDelegationProxyL2Abi } from './abi/veDelegationProxyL2'

export const AbiMap = {
  'balancer.vaultV2': balancerV2VaultAbi,
  'balancer.gaugeV5': balancerV2GaugeV5Abi,
  'balancer.minter': balancerMinterAbi,
  'balancer.relayerV6': balancerV2BalancerRelayerAbi,
  'balancer.feeDistributorStatic': FeeDistributorStaticAbi,
  'balancer.feeDistributor': FeeDistributorAbi,
  'balancer.veDelegationProxy': VeDelegationProxyAbi,
  'balancer.veDelegationProxyL2': VeDelegationProxyL2Abi,
  'balancer.veBAL': VeBALAbi,
  'balancer.LiquidityGauge': LiquidityGaugeAbi,
}

export type AbiMapType = keyof typeof AbiMap | undefined
