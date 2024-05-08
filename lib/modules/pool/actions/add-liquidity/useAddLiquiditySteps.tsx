import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { usePool } from '../../usePool'
import { InputAmount } from '@balancer/sdk'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'
import { useApproveRelayerStep } from '@/lib/modules/relayer/approveRelayerConfig'
import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { useSignRelayerStep } from '@/lib/modules/transactions/transaction-steps/SignRelayerButton'
import { TransactionStep2 } from '@/lib/modules/transactions/transaction-steps/lib'
import { useAddLiquidityStep } from './useAddLiquidityStep'
import { useTokenApprovalSteps } from '@/lib/modules/tokens/approvals/useTokenApprovalSteps'
import { AddLiquiditySimulationQueryResult } from './queries/useAddLiquiditySimulationQuery'
import { AddLiquidityBuildQueryResponse } from './queries/useAddLiquidityBuildCallDataQuery'

export function useAddLiquiditySteps(
  inputAmounts: InputAmount[],
  simulationQuery: AddLiquiditySimulationQueryResult,
  buildCallDataQuery: AddLiquidityBuildQueryResponse
): TransactionStep2[] {
  const vaultAddress = useContractAddress('balancer.vaultV2')
  const { pool, chainId } = usePool()
  const relayerMode = useRelayerMode()
  const shouldSignRelayerApproval = useShouldSignRelayerApproval(chainId)
  const approveRelayerStep = useApproveRelayerStep(chainId)
  const signRelayerStep = useSignRelayerStep()

  const tokenApprovalSteps = useTokenApprovalSteps({
    spenderAddress: vaultAddress,
    chain: pool.chain,
    approvalAmounts: inputAmounts,
    actionType: 'AddLiquidity',
  })

  const addLiquidityStep = useAddLiquidityStep(simulationQuery, buildCallDataQuery)

  let steps: TransactionStep2[] = [...tokenApprovalSteps, addLiquidityStep]

  if (shouldSignRelayerApproval) {
    steps = [signRelayerStep, ...steps]
  }

  if (relayerMode === 'approveRelayer') {
    steps = [approveRelayerStep, ...steps]
  }

  return steps
}
