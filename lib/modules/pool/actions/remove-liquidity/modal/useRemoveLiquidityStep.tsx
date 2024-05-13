/* eslint-disable react-hooks/exhaustive-deps */
import { ManagedSendTransactionButton } from '@/lib/modules/transactions/transaction-steps/TransactionButton'
import { useTransactionState } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'
import {
  TransactionLabels,
  TransactionStep,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'
import { useEffect, useMemo, useState } from 'react'
import { usePool } from '../../../usePool'
import {
  RemoveLiquidityBuildQueryParams,
  useRemoveLiquidityBuildCallDataQuery,
} from '../queries/useRemoveLiquidityBuildCallDataQuery'

export const removeLiquidityStepId = 'remove-liquidity'

export type RemoveLiquidityStepParams = RemoveLiquidityBuildQueryParams

export function useRemoveLiquidityStep(params: RemoveLiquidityStepParams): TransactionStep {
  const [isBuildQueryEnabled, setIsBuildQueryEnabled] = useState(false)
  const { chainId, refetch: refetchPoolUserBalances } = usePool()
  const { getTransaction } = useTransactionState()

  const buildCallDataQuery = useRemoveLiquidityBuildCallDataQuery({
    ...params,
    enabled: isBuildQueryEnabled,
  })
  const simulationQuery = params.simulationQuery

  const labels: TransactionLabels = {
    init: 'Remove liquidity',
    title: 'Remove liquidity',
    confirming: 'Confirming...',
    confirmed: `Liquidity removed from pool!`,
    tooltip: 'Remove liquidity from pool.',
  }

  const gasEstimationMeta = sentryMetaForWagmiSimulation(
    'Error in RemoveLiquidity gas estimation',
    {
      simulationQueryData: simulationQuery.data,
      buildCallQueryData: buildCallDataQuery.data,
    }
  )

  const transaction = getTransaction(removeLiquidityStepId)

  const isComplete = () => transaction?.result.isSuccess || false

  useEffect(() => {
    // simulationQuery is refetched every 30 seconds by RemoveLiquidityTimeout
    if (simulationQuery.data && isBuildQueryEnabled) {
      buildCallDataQuery.refetch()
    }
  }, [simulationQuery.data])

  return useMemo(
    () => ({
      id: removeLiquidityStepId,
      stepType: 'removeLiquidity',
      labels,
      isComplete,
      renderAction: () => (
        <ManagedSendTransactionButton
          id={removeLiquidityStepId}
          labels={labels}
          chainId={chainId}
          txConfig={buildCallDataQuery.data}
          gasEstimationMeta={gasEstimationMeta}
        />
      ),
      onActivated: () => setIsBuildQueryEnabled(true),
      onDeactivated: () => setIsBuildQueryEnabled(false),
      onSuccess: () => refetchPoolUserBalances(),
    }),
    [transaction, simulationQuery.data, buildCallDataQuery.data]
  )
}
