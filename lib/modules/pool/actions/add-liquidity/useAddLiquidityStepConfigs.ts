import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { usePool } from '../../usePool'
import {
  ApproveTokenConfig,
  useTokenApprovalConfigs,
} from '@/lib/modules/tokens/approvals/useTokenApprovalConfigs'
import { InputAmount } from '@balancer/sdk'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'

export enum AddLiquidityStepType {
  ADD_LIQUIDITY = 'addLiquidity',
  SIGN_RELAYER = 'signRelayer',
  APPROVE_RELAYER = 'approveRelayer',
  APPROVE_TOKEN = 'approveToken',
}

const addLiquidityConfig = {
  type: AddLiquidityStepType.ADD_LIQUIDITY,
} as const

const approveRelayerConfig = {
  type: AddLiquidityStepType.APPROVE_RELAYER,
} as const

const signRelayerConfig = {
  type: AddLiquidityStepType.SIGN_RELAYER,
} as const

export type AddLiquidityStepConfig =
  | typeof approveRelayerConfig
  | typeof signRelayerConfig
  | ApproveTokenConfig
  | typeof addLiquidityConfig

export function useAddLiquidityStepConfigs(inputAmounts: InputAmount[]) {
  const relayerMode = useRelayerMode()
  const vaultAddress = useContractAddress('balancer.vaultV2')
  const { pool } = usePool()

  const tokenApprovalConfigs = useTokenApprovalConfigs({
    spenderAddress: vaultAddress,
    chain: pool.chain,
    approvalAmounts: inputAmounts,
    actionType: 'AddLiquidity',
  })

  let stepConfigs: AddLiquidityStepConfig[] = [...tokenApprovalConfigs, addLiquidityConfig]

  if (relayerMode === 'approveRelayer') {
    stepConfigs = [approveRelayerConfig, ...stepConfigs]
  }

  if (relayerMode === 'signRelayer') {
    stepConfigs = [signRelayerConfig, ...stepConfigs]
  }

  return stepConfigs
}
