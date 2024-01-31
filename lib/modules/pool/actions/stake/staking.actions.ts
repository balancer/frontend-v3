import { GqlPoolStaking, GqlPoolStakingType } from '@/lib/shared/services/api/generated/graphql'
import { useManagedTransaction } from '@/lib/modules/web3/contracts/useManagedTransaction'
import { TransactionLabels, FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { useActiveStep } from '@/lib/shared/hooks/transaction-flows/useActiveStep'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'

function buildStakingDepositLabels(staking?: GqlPoolStaking | null): TransactionLabels {
  const labels: TransactionLabels = {
    init: 'Stake',
    confirming: 'Confirming...',
    confirmed: `BPT deposited in ${staking?.type}!`,
    tooltip: 'TODO DEPOSIT TOOLTIP',
  }
  return labels
}

function buildStakingWithdrawLabels(staking?: GqlPoolStaking | null): TransactionLabels {
  const labels: TransactionLabels = {
    init: 'Unstake',
    confirming: 'Confirming...',
    confirmed: `BPT withdrawn from  ${staking?.type}!`,
    tooltip: 'TODO WITHDRAW TOOLTIP',
  }
  return labels
}

function getStakingConfig(
  staking?: GqlPoolStaking | null,
  amount?: bigint
):
  | {
      contractAddress: string | undefined
      contractId: any
      args: any
    }
  | undefined {
  const { userAddress } = useUserAccount()

  if (staking) {
    switch (staking.type) {
      case 'MASTER_CHEF':
        return {
          contractAddress: 'masterChefContractAddress', // TODO update this
          contractId: 'balancer.gaugeV5', // TODO change this to farm
          args: [staking.farm?.id, amount, userAddress],
          // TODO: add function name too?
        }
      case 'GAUGE':
        return {
          contractAddress: staking.gauge?.gaugeAddress,
          contractId: 'balancer.gaugeV5',
          args: [amount || 0n],
          // TODO: add function name too?
        }
    }
  }
}

export function useConstructStakingDepositActionStep(
  staking?: GqlPoolStaking | null,
  depositAmount?: bigint
): FlowStep {
  const { activateStep } = useActiveStep()
  const transactionLabels = buildStakingDepositLabels(staking)
  const stakingConfig = getStakingConfig(staking, depositAmount)

  const deposit = useManagedTransaction(
    stakingConfig?.contractAddress || '',
    stakingConfig?.contractId,
    'deposit',
    transactionLabels,
    { args: stakingConfig?.args },
    { enabled: !!staking || !!depositAmount }
  )

  const step: FlowStep = {
    ...deposit,
    id: `${staking?.type}-deposit`,
    stepType: 'stakingDeposit',
    transactionLabels,
    activateStep,
    isComplete: () => deposit.result.isSuccess,
  }
  return step
}

export function useConstructStakingWithdrawActionStep(
  staking?: GqlPoolStaking | null,
  withdrawAmount?: bigint
): FlowStep {
  const { activateStep } = useActiveStep()
  const transactionLabels = buildStakingWithdrawLabels(staking)
  const stakingConfig = getStakingConfig(staking, withdrawAmount)

  const withdraw = useManagedTransaction(
    stakingConfig?.contractAddress || '',
    stakingConfig?.contractId,
    'withdraw',
    transactionLabels,
    { args: stakingConfig?.args },
    { enabled: !!staking || !!withdrawAmount }
  )

  const step: FlowStep = {
    ...withdraw,
    id: `${staking?.type}-withdraw`,
    stepType: 'stakingWithdraw',
    transactionLabels,
    activateStep,
    isComplete: () => withdraw.result.isSuccess,
  }
  return step
}
