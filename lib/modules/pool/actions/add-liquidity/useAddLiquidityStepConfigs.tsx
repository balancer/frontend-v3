import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { usePool } from '../../usePool'
import { useTokenApprovalConfigs } from '@/lib/modules/tokens/approvals/useTokenApprovalConfigs'
import { InputAmount } from '@balancer/sdk'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'
import { TransactionState } from '@/lib/shared/components/btns/transaction-steps/lib'
import { approveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { AddLiquidityButton } from './AddLiquidityButton'

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

  const addLiquidityStepConfig = {
    render: () => <AddLiquidityButton onTransactionStateUpdate={setAddLiquidityTxState} />,
  }

  let stepConfigs = [...tokenApprovalConfigs, addLiquidityStepConfig]

  if (relayerMode === 'approveRelayer') {
    stepConfigs = [approveRelayerConfig, ...stepConfigs]
  }

  return stepConfigs
}
