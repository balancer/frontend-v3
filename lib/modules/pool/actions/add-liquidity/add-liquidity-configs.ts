import { ApproveTokenConfig } from './useConstructApproveTokenConfigs'

export const addLiquidityConfig = {
  type: 'addLiquidity',
} as const

export const approveRelayerConfig = {
  type: 'approveRelayer',
} as const

export const signRelayerConfig = {
  type: 'signRelayer',
} as const

export type SupportedStepConfig =
  | typeof approveRelayerConfig
  | typeof signRelayerConfig
  | ApproveTokenConfig
  | typeof addLiquidityConfig
