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
import { useMemo } from 'react'

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

  return useMemo(() => {
    if (relayerMode === 'approveRelayer') {
      return [approveRelayerStep, ...tokenApprovalSteps, addLiquidityStep]
    } else if (shouldSignRelayerApproval) {
      return [signRelayerStep, ...tokenApprovalSteps, addLiquidityStep]
    }

    return [...tokenApprovalSteps, addLiquidityStep]
  }, [
    relayerMode,
    shouldSignRelayerApproval,
    tokenApprovalSteps,
    addLiquidityStep,
    approveRelayerStep,
    signRelayerStep,
  ])
}
