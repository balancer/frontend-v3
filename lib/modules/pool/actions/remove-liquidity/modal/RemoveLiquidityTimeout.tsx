/* eslint-disable react-hooks/exhaustive-deps */
import { Text } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useCountdown } from 'usehooks-ts'
import { TransactionState } from '@/lib/shared/components/btns/transaction-steps/lib'
import { useRemoveLiquidity } from '../useRemoveLiquidity'

type Props = {
  removeLiquidityTxState?: TransactionState
}

function useRemoveLiquidityTimeout({ removeLiquidityTxState }: Props) {
  // This countdown needs to be nested here and not at a higher level, like in
  // useRemoveLiquidity, because otherwise it causes re-renders of the entire
  // remove-liquidity flow component tree every second.
  const [secondsToRefetch, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
    countStart: 30,
    intervalMs: 1000,
  })

  const { simulationQuery, priceImpactQuery, previewModalDisclosure } = useRemoveLiquidity()

  const isConfirmingRemoveLiquidity = removeLiquidityTxState === TransactionState.Confirming
  const isAwaitingUserConfirmation = removeLiquidityTxState === TransactionState.Loading
  const isComplete = removeLiquidityTxState === TransactionState.Completed

  // Disable query refetches:
  // if the flow is complete
  // if the remove liquidity transaction is confirming
  const shouldFreezeQuote = isComplete || isConfirmingRemoveLiquidity || isAwaitingUserConfirmation

  // When the countdown timer reaches 0, refetch all remove liquidity queries.
  useEffect(() => {
    const refetchQueries = async () => {
      stopCountdown()
      resetCountdown()
      await Promise.all([simulationQuery.refetch(), priceImpactQuery.refetch()])
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

export function RemoveLiquidityTimeout(props: Props) {
  const { secondsToRefetch, shouldFreezeQuote } = useRemoveLiquidityTimeout(props)

  return !shouldFreezeQuote && <Text>Quote expires in: {secondsToRefetch} secs</Text>
}
