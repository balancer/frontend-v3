import { GqlPoolStakingGauge } from '@/lib/shared/services/api/generated/graphql'
import { useManagedTransaction } from '../web3/contracts/useManagedTransaction'
import {
  TransactionLabels,
  TransactionStep,
} from '@/lib/shared/components/btns/transaction-steps/lib'
import { useActiveStep } from '@/lib/shared/hooks/transaction-flows/useActiveStep'

function getDepositTransactionLabels(gauge?: GqlPoolStakingGauge | null): TransactionLabels {
  const labels: TransactionLabels = {
    init: 'TODO DEPOSIT INIT',
    tooltip: 'TODO DEPOSIT TOOLTIP',
  }
  return labels
}

function getWithdrawTransactionLabels(gauge?: GqlPoolStakingGauge | null): TransactionLabels {
  const labels: TransactionLabels = {
    init: 'TODO WITHDRAW INNIT',
    tooltip: 'TODO WITHDRAW TOOLTIP',
  }
  return labels
}

export function useConstructGaugeDepositActionStep(
  gauge?: GqlPoolStakingGauge | null,
  depositAmount?: bigint
): TransactionStep {
  const { activateStep } = useActiveStep()
  const labels = getDepositTransactionLabels(gauge)
  const deposit = useManagedTransaction(
    'balancer.gaugeV5',
    'deposit',
    labels,
    { args: [depositAmount || 0n] },
    { enabled: !!gauge || !!depositAmount }
  )

  function isComplete() {
    return deposit.result.isSuccess
  }

  const step: TransactionStep = {
    ...deposit,
    id: `${gauge?.gaugeAddress}-deposit`,
    stepType: 'gaugeDeposit',
    transactionLabels: labels,
    activateStep,
    isComplete,
  }
  return step
}

export function useConstructGaugeWithdrawActionStep(
  gauge?: GqlPoolStakingGauge | null,
  withdrawAmount?: bigint
): TransactionStep {
  const { activateStep } = useActiveStep()
  const labels = getWithdrawTransactionLabels(gauge)
  const withdraw = useManagedTransaction(
    'balancer.gaugeV5',
    'withdraw',
    labels,
    { args: [withdrawAmount || 0n] },
    { enabled: !!gauge || !!withdrawAmount }
  )

  function isComplete() {
    return withdraw.result.isSuccess
  }

  const step: TransactionStep = {
    ...withdraw,
    id: `${gauge?.gaugeAddress}-withdraw`,
    stepType: 'gaugeWithdraw',
    transactionLabels: labels,
    activateStep,
    isComplete,
  }
  return step
}
