import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { usePool } from '../../usePool'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'
import { useApproveRelayerStep } from '@/lib/modules/relayer/approveRelayerConfig'
import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { useSignRelayerStep } from '@/lib/modules/transactions/transaction-steps/SignRelayerButton'
import { useAddLiquidityStep } from './useAddLiquidityStep'
import { useTokenApprovalSteps } from '@/lib/modules/tokens/approvals/useTokenApprovalSteps'
import { AddLiquiditySimulationQueryResult } from './queries/useAddLiquiditySimulationQuery'
import { useMemo } from 'react'
import { HumanAmountIn } from '../liquidity-types'
import { LiquidityActionHelpers } from '../LiquidityActionHelpers'
import { AddLiquidityHandler } from './handlers/AddLiquidity.handler'

export function useAddLiquiditySteps(
  helpers: LiquidityActionHelpers,
  handler: AddLiquidityHandler,
  humanAmountsIn: HumanAmountIn[],
  simulationQuery: AddLiquiditySimulationQueryResult
) {
  const vaultAddress = useContractAddress('balancer.vaultV2')
  const { pool, chainId } = usePool()
  const relayerMode = useRelayerMode()
  const shouldSignRelayerApproval = useShouldSignRelayerApproval(chainId)
  const approveRelayerStep = useApproveRelayerStep(chainId)
  const signRelayerStep = useSignRelayerStep()

  const inputAmounts = useMemo(
    () => helpers.toInputAmounts(humanAmountsIn),
    [humanAmountsIn, helpers]
  )

  const { isLoading: isLoadingTokenApprovalSteps, steps: tokenApprovalSteps } =
    useTokenApprovalSteps({
      spenderAddress: vaultAddress,
      chain: pool.chain,
      approvalAmounts: inputAmounts,
      actionType: 'AddLiquidity',
    })

  const addLiquidityStep = useAddLiquidityStep(handler, humanAmountsIn, simulationQuery)

  const steps = useMemo(() => {
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

  return {
    isLoadingSteps: isLoadingTokenApprovalSteps,
    steps,
  }
}
