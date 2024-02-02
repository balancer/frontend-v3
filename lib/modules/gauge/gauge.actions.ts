import { GqlPoolStakingGauge } from '@/lib/shared/services/api/generated/graphql'
import { useManagedTransaction } from '../web3/contracts/useManagedTransaction'
import {
  TransactionLabels,
  TransactionStep,
} from '@/lib/shared/components/btns/transaction-steps/lib'

function buildGaugeDepositLabels(gauge?: GqlPoolStakingGauge | null): TransactionLabels {
  const labels: TransactionLabels = {
    init: 'TODO DEPOSIT INIT',
    tooltip: 'TODO DEPOSIT TOOLTIP',
  }
  return labels
}

function buildGaugeWithdrawLabels(gauge?: GqlPoolStakingGauge | null): TransactionLabels {
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
  const transactionLabels = buildGaugeDepositLabels(gauge)
  const deposit = useManagedTransaction(
    gauge?.gaugeAddress || '',
    'balancer.gaugeV5',
    'deposit',
    transactionLabels,
    { args: [depositAmount || 0n] },
    { enabled: !!gauge || !!depositAmount }
  )

  const step: TransactionStep = {
    ...deposit,
    id: `${gauge?.gaugeAddress}-deposit`,
    stepType: 'gaugeDeposit',
    transactionLabels,
    isComplete: () => deposit.result.isSuccess,
  }
  return step
}

export function useConstructGaugeWithdrawActionStep(
  gauge?: GqlPoolStakingGauge | null,
  withdrawAmount?: bigint
): TransactionStep {
  const transactionLabels = buildGaugeWithdrawLabels(gauge)
  const withdraw = useManagedTransaction(
    gauge?.gaugeAddress || '',
    'balancer.gaugeV5',
    'withdraw',
    transactionLabels,
    { args: [withdrawAmount || 0n] },
    { enabled: !!gauge || !!withdrawAmount }
  )

  const step: TransactionStep = {
    ...withdraw,
    id: `${gauge?.gaugeAddress}-withdraw`,
    stepType: 'gaugeWithdraw',
    transactionLabels,
    isComplete: () => withdraw.result.isSuccess,
  }
  return step
}
