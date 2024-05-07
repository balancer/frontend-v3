import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { usePool } from '../../usePool'
import { InputAmount } from '@balancer/sdk'
import { useRelayerMode } from '@/lib/modules/relayer/useRelayerMode'
import { useApproveRelayerStep } from '@/lib/modules/relayer/approveRelayerConfig'
import { useShouldSignRelayerApproval } from '@/lib/modules/relayer/signRelayerApproval.hooks'
import { signRelayerStep2 } from '@/lib/modules/transactions/transaction-steps/SignRelayerButton'
import { TransactionStep2 } from '@/lib/modules/transactions/transaction-steps/lib'
import { useAddLiquidityStep } from './useAddLiquidityStep'
import { useTokenApprovalSteps } from '@/lib/modules/tokens/approvals/useTokenApprovalSteps'

export function useAddLiquiditySteps(inputAmounts: InputAmount[]): TransactionStep2[] {
  const vaultAddress = useContractAddress('balancer.vaultV2')
  const { pool, chainId } = usePool()
  const relayerMode = useRelayerMode()
  const shouldSignRelayerApproval = useShouldSignRelayerApproval(chainId)
  const approveRelayerStep = useApproveRelayerStep(chainId)

  const tokenApprovalSteps = useTokenApprovalSteps({
    spenderAddress: vaultAddress,
    chain: pool.chain,
    approvalAmounts: inputAmounts,
    actionType: 'AddLiquidity',
  })

  const addLiquidityStep = useAddLiquidityStep()

  let steps: TransactionStep2[] = [...tokenApprovalSteps, addLiquidityStep]

  if (shouldSignRelayerApproval) {
    steps = [signRelayerStep2, ...steps]
  }

  if (relayerMode === 'approveRelayer') {
    steps = [approveRelayerStep, ...steps]
  }

  return steps
}
