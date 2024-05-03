/* eslint-disable react-hooks/exhaustive-deps */
import { useManagedSendTransaction } from '@/lib/modules/web3/contracts/useManagedSendTransaction'
import { TransactionLabels, swapStepId } from '@/lib/modules/transactions/transaction-steps/lib'
import { useEffect } from 'react'
import { useSwap } from './useSwap'
import { useBuildSwapQuery } from './queries/useBuildSwapQuery'
import { getChainId } from '@/lib/config/app.config'
import { useSyncCurrentFlowStep } from '../transactions/transaction-steps/useCurrentFlowStep'
import { capitalize } from 'lodash'
import { swapActionPastTense } from './swap.helpers'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'

export function useConstructSwapStep() {
  const { simulationQuery, selectedChain, swapAction, tokenInInfo, tokenOutInfo } = useSwap()
  const buildSwapQuery = useBuildSwapQuery()

  const tokenInSymbol = tokenInInfo?.symbol || 'Unknown'
  const tokenOutSymbol = tokenOutInfo?.symbol || 'Unknown'

  const transactionLabels: TransactionLabels = {
    init: capitalize(swapAction),
    confirming: 'Confirming swap...',
    confirmed: `${swapActionPastTense(swapAction)}!`,
    tooltip: `${capitalize(swapAction)} ${tokenInSymbol} for ${tokenOutSymbol}`,
    description: `${capitalize(swapAction)} ${tokenInSymbol} for ${tokenOutSymbol}`,
  }

  useEffect(() => {
    // simulationQuery is refetched every 30 seconds by SwapTimeout
    if (simulationQuery.data) {
      buildSwapQuery.refetch()
    }
  }, [JSON.stringify(simulationQuery.data)])

  const chainId = buildSwapQuery.data?.chainId || getChainId(selectedChain)

  const swapTransaction = useManagedSendTransaction(
    transactionLabels,
    chainId,
    buildSwapQuery.data,
    sentryMetaForWagmiSimulation('Error in swap gas estimation', buildSwapQuery.data || {})
  )

  const isComplete = () => swapTransaction.result.isSuccess

  const swapStep = useSyncCurrentFlowStep({
    ...swapTransaction,
    transactionLabels,
    id: swapStepId,
    stepType: 'swap',
    isComplete,
  })

  return {
    swapStep,
    swapTransaction,
  }
}
