/* eslint-disable react-hooks/exhaustive-deps */
import { Text } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useCountdown } from 'usehooks-ts'
import { useAddLiquidity } from './useAddLiquidity'
import {
  TransactionState,
  getTransactionState,
} from '@/lib/shared/components/btns/transaction-steps/lib'
import { AddLiquidityBuildQueryResponse } from './queries/useAddLiquidityBuildCallDataQuery'
import { TransactionBundle } from '@/lib/modules/web3/contracts/contract.types'

type Props = {
  addLiquidityTransaction: TransactionBundle
  isFinalStepActive: boolean
  buildCallDataQuery: AddLiquidityBuildQueryResponse
}

function useAddLiquidityTimeout({
  addLiquidityTransaction,
  isFinalStepActive,
  buildCallDataQuery,
}: Props) {
  // This countdown needs to be nested here and not at a higher level, like in
  // useAddLiquidity, because otherwise it causes re-renders of the entire
  // add-liquidity flow component tree every second.
  const [secondsToRefetch, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
    countStart: 30,
    intervalMs: 1000,
  })

  const { simulationQuery, priceImpactQuery, previewModalDisclosure } = useAddLiquidity()

  const transactionState = getTransactionState(addLiquidityTransaction)
  const isConfirmingAddLiquidity = transactionState === TransactionState.Confirming
  const isAwaitingUserConfirmation = transactionState === TransactionState.Loading
  const isComplete = transactionState === TransactionState.Completed

  // Disable query refetches:
  // if the flow is complete
  // if the add liquidity transaction is confirming
  const shouldFreezeQuote = isComplete || isConfirmingAddLiquidity || isAwaitingUserConfirmation

  // When the countdown timer reaches 0, refetch all add liquidity queries.
  useEffect(() => {
    const refetchQueries = async () => {
      stopCountdown()
      resetCountdown()
      await Promise.all([simulationQuery.refetch(), priceImpactQuery.refetch()])
      if (isFinalStepActive) await buildCallDataQuery.refetch() // avoid this refetch if the final step is not enabled (for example during pre-approval steps)
      startCountdown()
    }
    if (secondsToRefetch === 0 && !shouldFreezeQuote) refetchQueries()
  }, [secondsToRefetch])

  // If the transaction flow is complete or confirming, stop the countdown timer.
  // Else start the timer.
  useEffect(() => {
    if (shouldFreezeQuote) {
      stopCountdown()
      resetCountdown()
    } else {
      startCountdown()
    }
  }, [shouldFreezeQuote])

  // When the modal is closed the timeout should be stopped and reset.
  useEffect(() => {
    if (!previewModalDisclosure.isOpen) {
      stopCountdown()
      resetCountdown()
    }
  }, [previewModalDisclosure.isOpen])

  return { secondsToRefetch, shouldFreezeQuote }
}

export function AddLiquidityTimeout(props: Props) {
  const { secondsToRefetch, shouldFreezeQuote } = useAddLiquidityTimeout(props)

  return !shouldFreezeQuote && <Text>Quote expires in: {secondsToRefetch} secs</Text>
}
