import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { usePool } from '../../usePool'
import { useTokenApprovalConfigs } from '@/lib/modules/tokens/approvals/useTokenApprovalConfigs'
import { InputAmount } from '@balancer/sdk'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'
import { AddLiquidityButton } from './AddLiquidityButton'
import { TransactionState } from '@/lib/shared/components/btns/transaction-steps/lib'
import { OnStepCompleted, StepConfig } from '../useIterateSteps'
import { ApproveRelayerButton } from '@/lib/modules/relayer/ApproveRelayerButton'

export function useAddLiquidityConfig(
  setAddLiquidityTxState: (transactionState: TransactionState) => void
): StepConfig {
  function render() {
    return (
      <AddLiquidityButton onTransactionStateUpdate={setAddLiquidityTxState}></AddLiquidityButton>
    )
  }
  return {
    render,
  }
}

const approveRelayerConfig: StepConfig = {
  render(useOnStepCompleted: OnStepCompleted) {
    return <ApproveRelayerButton useOnStepCompleted={useOnStepCompleted}></ApproveRelayerButton>
  },
}

const signRelayerConfig: StepConfig = {
  render: () => <div>TO BE IMPLEMENTED</div>,
} as const

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

  let stepConfigs = [...tokenApprovalConfigs, useAddLiquidityConfig(setAddLiquidityTxState)]

  if (relayerMode === 'approveRelayer') {
    stepConfigs = [approveRelayerConfig, ...stepConfigs]
  }

  if (relayerMode === 'signRelayer') {
    stepConfigs = [signRelayerConfig, ...stepConfigs]
  }

  return stepConfigs
}
