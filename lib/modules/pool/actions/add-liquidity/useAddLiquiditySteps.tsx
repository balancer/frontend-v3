import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { usePool } from '../../usePool'
import { useTokenApprovalConfigs } from '@/lib/modules/tokens/approvals/useTokenApprovalConfigs'
import { InputAmount } from '@balancer/sdk'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'
import { getApproveRelayerConfig } from '@/lib/modules/relayer/approveRelayerConfig'
import { AddLiquidityButton } from './AddLiquidityButton'
import { StepConfig } from '../../../transactions/transaction-steps/useIterateSteps'
import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { signRelayerStep } from '@/lib/modules/transactions/transaction-steps/SignRelayerButton'
import { TxStep } from '@/lib/modules/transactions/transaction-steps/lib'
import { useConstructAddLiquidityStep } from './useConstructAddLiquidityStep'
import { useTokenApprovalSteps } from '@/lib/modules/tokens/approvals/useTokenApprovalSteps'

export function useAddLiquiditySteps(inputAmounts: InputAmount[]): TxStep[] {
  const vaultAddress = useContractAddress('balancer.vaultV2')
  const { pool, chainId } = usePool()
  const relayerMode = useRelayerMode()
  const shouldSignRelayerApproval = useShouldSignRelayerApproval(chainId)

  const tokenApprovalSteps = useTokenApprovalSteps({
    spenderAddress: vaultAddress,
    chain: pool.chain,
    approvalAmounts: inputAmounts,
    actionType: 'AddLiquidity',
  })

  const addLiquidityStep = useConstructAddLiquidityStep()

  const steps: TxStep[] = [addLiquidityStep]

  // if (shouldSignRelayerApproval) {
  //   stepConfigs = [signRelayerStep, ...stepConfigs]
  // }

  // if (relayerMode === 'approveRelayer') {
  //   stepConfigs = [getApproveRelayerConfig(chainId), ...stepConfigs]
  // }

  return steps
}
