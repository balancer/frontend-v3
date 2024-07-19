/* eslint-disable react-hooks/exhaustive-deps */
import { ManagedSendTransactionButton } from '@/lib/modules/transactions/transaction-steps/TransactionButton'
import {
  TransactionLabels,
  TransactionStep,
} from '@/lib/modules/transactions/transaction-steps/lib'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'
import { VStack } from '@chakra-ui/react'
import { capitalize } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useTransactionState } from '../transactions/transaction-steps/TransactionStateProvider'
import { BuildSwapQueryParams, useBuildSwapQuery } from './queries/useBuildSwapQuery'
import { swapActionPastTense } from './swap.helpers'
import { SwapAction } from './swap.types'
import { useTokenBalances } from '../tokens/TokenBalancesProvider'
import { useUserAccount } from '../web3/UserAccountProvider'
import { GenericError } from '@/lib/shared/components/errors/GenericError'

export const swapStepId = 'swap'

export type SwapStepParams = BuildSwapQueryParams & {
  swapAction: SwapAction
  tokenInInfo: GqlToken | undefined
  tokenOutInfo: GqlToken | undefined
}

export function useSwapStep({
  handler,
  simulationQuery,
  swapState,
  swapAction,
  wethIsEth,
  tokenInInfo,
  tokenOutInfo,
}: SwapStepParams): TransactionStep {
  const { isConnected } = useUserAccount()
  const [isBuildQueryEnabled, setIsBuildQueryEnabled] = useState(false)
  const { getTransaction } = useTransactionState()
  const { refetchBalances } = useTokenBalances()

  const buildSwapQuery = useBuildSwapQuery({
    handler,
    simulationQuery,
    wethIsEth,
    swapState,
    enabled: isBuildQueryEnabled && !!simulationQuery.data,
  })

  const tokenInSymbol = tokenInInfo?.symbol || 'Unknown'
  const tokenOutSymbol = tokenOutInfo?.symbol || 'Unknown'

  const labels: TransactionLabels = {
    init: capitalize(swapAction),
    title: capitalize(swapAction),
    confirming: 'Confirming swap...',
    confirmed: `${swapActionPastTense(swapAction)}!`,
    tooltip: `${capitalize(swapAction)} ${tokenInSymbol} for ${tokenOutSymbol}`,
    description: `${capitalize(swapAction)} ${tokenInSymbol} for ${tokenOutSymbol}`,
  }

  useEffect(() => {
    // simulationQuery is refetched every 30 seconds by SwapTimeout
    if (simulationQuery.data && isConnected) {
      buildSwapQuery.refetch()
    }
  }, [simulationQuery.data])

  const gasEstimationMeta = sentryMetaForWagmiSimulation(
    'Error in swap gas estimation',
    buildSwapQuery.data || {}
  )

  const transaction = getTransaction(swapStepId)

  const isComplete = () => transaction?.result.isSuccess || false

  return useMemo(
    () => ({
      id: swapStepId,
      stepType: 'swap',
      labels,
      isComplete,
      onActivated: () => setIsBuildQueryEnabled(true),
      onDeactivated: () => setIsBuildQueryEnabled(false),
      onSuccess: () => refetchBalances(),
      renderAction: () => (
        <VStack w="full">
          {buildSwapQuery.error ? (
            <GenericError error={buildSwapQuery.error}></GenericError>
          ) : (
            <ManagedSendTransactionButton
              id={swapStepId}
              labels={labels}
              txConfig={buildSwapQuery.data}
              gasEstimationMeta={gasEstimationMeta}
            />
          )}
        </VStack>
      ),
    }),
    [transaction, simulationQuery.data, buildSwapQuery.data]
  )
}
