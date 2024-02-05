import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { usePool } from '../../usePool'
import { useTokenApprovalConfigs } from '@/lib/modules/tokens/approvals/useTokenApprovalConfigs'
import { InputAmount } from '@balancer/sdk'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'
import {
  OnTransactionStateUpdate,
  TransactionState,
} from '@/lib/shared/components/btns/transaction-steps/lib'
import { approveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { AddLiquidityButton } from './AddLiquidityButton'
import { signRelayerConfig } from '@/lib/modules/relayer/signRelayerConfig'
import { StepConfig } from '../useIterateSteps'

function buildAddLiquidityConfig(onTransactionStateUpdate: OnTransactionStateUpdate): StepConfig {
  return {
    render: () => <AddLiquidityButton onTransactionStateUpdate={onTransactionStateUpdate} />,
  }
}

export function useAddLiquidityStepConfigs(
  inputAmounts: InputAmount[],
  setAddLiquidityTxState: (transactionState: TransactionState) => void
) {
  const relayerMode = useRelayerMode()
  const vaultAddress = useContractAddress('balancer.vaultV2')
  const { pool } = usePool()

  const tokenApprovalConfigs = useTokenApprovalConfigs({
    spenderAddress: vaultAddress,
    chain: pool.chain,
    approvalAmounts: inputAmounts,
    actionType: 'AddLiquidity',
  })

  let stepConfigs = [...tokenApprovalConfigs, buildAddLiquidityConfig(setAddLiquidityTxState)]

  if (relayerMode === 'approveRelayer') {
    stepConfigs = [approveRelayerConfig, ...stepConfigs]
  }

  if (relayerMode === 'signRelayer') {
    stepConfigs = [signRelayerConfig, ...stepConfigs]
  }

  return stepConfigs
}
