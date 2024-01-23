/* eslint-disable react-hooks/exhaustive-deps */
import { Text } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useCountdown } from 'usehooks-ts'
import { useAddLiquidity } from './useAddLiquidity'
import {
  TransactionState,
  getTransactionState,
} from '@/lib/shared/components/btns/transaction-steps/lib'

function useAddLiquidityTimeout() {
  // This countdown needs to be nested here and not at a higher level, like in
  // useAddLiquidity, because otherwise it causes re-renders of the entire
  // add-liquidity flow component tree every second.
  const [secondsToRefetch, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
    countStart: 30,
    intervalMs: 1000,
  })

  const {
    simulationQuery,
    priceImpactQuery,
    buildCallDataQuery,
    previewModalDisclosure,
    addLiquidityTransaction,
  } = useAddLiquidity()

  const addLiquidityTransactionState = getTransactionState(addLiquidityTransaction)

  const isConfirmingAddLiquidity = addLiquidityTransactionState === TransactionState.Confirming
  const isAwaitingUserConfirmation = addLiquidityTransactionState === TransactionState.Loading
  const isComplete = addLiquidityTransactionState === TransactionState.Completed

  // If the flow is complete or the final add liquidity transaction is
  // confirming, disable query refetches.
  const shouldFreezeQuote = isComplete || isConfirmingAddLiquidity || isAwaitingUserConfirmation

  // When the countdown timer reaches 0, refetch all add liquidity queries.
  useEffect(() => {
    const refetchQueries = async () => {
      stopCountdown()
      resetCountdown()
      await Promise.all([simulationQuery.refetch(), priceImpactQuery.refetch()])
      await buildCallDataQuery.refetch()
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

export function AddLiquidityTimeout() {
  const { secondsToRefetch, shouldFreezeQuote } = useAddLiquidityTimeout()

  return !shouldFreezeQuote && <Text>Quote expires in: {secondsToRefetch} secs</Text>
}
