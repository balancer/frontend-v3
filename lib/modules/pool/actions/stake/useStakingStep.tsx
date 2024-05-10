import { ManagedTransactionButton } from '@/lib/modules/transactions/transaction-steps/TransactionButton'
import { useTransactionState } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'
import { TransactionStep, swapStepId } from '@/lib/modules/transactions/transaction-steps/lib'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'
import { useMemo, useState } from 'react'
import { buildStakingDepositLabels, getStakingConfig } from '../../../staking/staking.actions'
import { Pool, usePool } from '../../usePool'

const stakeStepId = 'stake'

export function useStakingStep(pool: Pool, rawDepositAmount: bigint): TransactionStep {
  const [isStakeEnabled, setIsStakeEnabled] = useState(false)

  const { refetch: refetchPool, chainId } = usePool()
  const { getTransaction } = useTransactionState()
  const labels = buildStakingDepositLabels(pool.staking)
  const { userAddress } = useUserAccount()
  const stakingConfig = getStakingConfig(pool.staking, rawDepositAmount, userAddress)

  const txSimulationMeta = sentryMetaForWagmiSimulation(
    'Error in wagmi tx simulation (Staking deposit transaction)',
    {
      chainId,
      userAddress,
      staking: pool.staking,
      rawDepositAmount,
      stakingConfig,
    }
  )

  const transaction = getTransaction(swapStepId)

  const isComplete = () => transaction?.result.isSuccess || false

  return useMemo(
    () => ({
      id: stakeStepId,
      stepType: 'stakingDeposit',
      labels,
      isComplete,
      onActivated: () => setIsStakeEnabled(true),
      onDeactivated: () => setIsStakeEnabled(false),
      onSuccess: () => refetchPool(),
      renderAction: () => (
        <ManagedTransactionButton
          enabled={(isStakeEnabled && !!pool.staking) || !!rawDepositAmount}
          id={swapStepId}
          labels={labels}
          chainId={chainId}
          contractId={stakingConfig?.contractId}
          contractAddress={stakingConfig?.contractAddress || ''}
          functionName="deposit"
          args={stakingConfig?.args}
          txSimulationMeta={txSimulationMeta}
        />
      ),
    }),
    [transaction, isStakeEnabled, pool.staking, rawDepositAmount, stakingConfig]
  )
}
