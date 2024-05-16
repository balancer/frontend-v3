/* eslint-disable react-hooks/exhaustive-deps */
import {
  TransactionLabels,
  TransactionStep,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { useAddLiquidityBuildCallDataQuery } from './queries/useAddLiquidityBuildCallDataQuery'
import { usePool } from '../../usePool'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'
import { ManagedSendTransactionButton } from '@/lib/modules/transactions/transaction-steps/TransactionButton'
import { AddLiquiditySimulationQueryResult } from './queries/useAddLiquiditySimulationQuery'
import { useEffect, useMemo, useState } from 'react'
import { useTransactionState } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'
import { AddLiquidityHandler } from './handlers/AddLiquidity.handler'
import { HumanAmountIn } from '../liquidity-types'

export const addLiquidityStepId = 'add-liquidity'

export function useAddLiquidityStep(
  handler: AddLiquidityHandler,
  humanAmountsIn: HumanAmountIn[],
  simulationQuery: AddLiquiditySimulationQueryResult
): TransactionStep {
  const [isBuildQueryEnabled, setIsBuildQueryEnabled] = useState(false)

  const { chainId, pool } = usePool()
  const { getTransaction } = useTransactionState()

  const buildCallDataQuery = useAddLiquidityBuildCallDataQuery(
    handler,
    humanAmountsIn,
    simulationQuery,
    isBuildQueryEnabled
  )

  const labels: TransactionLabels = {
    init: 'Add liquidity',
    title: 'Add liquidity',
    description: `Adding liquidity to ${pool.name || 'pool'}.`,
    confirming: 'Confirming add liquidity...',
    confirmed: `Liquidity added!`,
    tooltip: `Add liquidity to ${pool.name || 'pool'}.`,
  }

  const gasEstimationMeta = sentryMetaForWagmiSimulation('Error in AddLiquidity gas estimation', {
    simulationQueryData: simulationQuery.data,
    buildCallQueryData: buildCallDataQuery.data,
  })

  const transaction = getTransaction(addLiquidityStepId)

  const isComplete = () => transaction?.result.isSuccess || false

  useEffect(() => {
    // simulationQuery is refetched every 30 seconds by AddLiquidityTimeout
    if (simulationQuery.data && isBuildQueryEnabled) {
      buildCallDataQuery.refetch()
    }
  }, [simulationQuery.data])

  return useMemo(
    () => ({
      id: addLiquidityStepId,
      stepType: 'addLiquidity',
      labels,
      isComplete,
      onActivated: () => setIsBuildQueryEnabled(true),
      onDeactivated: () => setIsBuildQueryEnabled(false),
      renderAction: () => (
        <ManagedSendTransactionButton
          id={addLiquidityStepId}
          labels={labels}
          chainId={chainId}
          txConfig={buildCallDataQuery.data}
          gasEstimationMeta={gasEstimationMeta}
        />
      ),
    }),
    [transaction, simulationQuery.data, buildCallDataQuery.data]
  )
}
