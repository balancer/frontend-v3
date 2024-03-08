/* eslint-disable react-hooks/exhaustive-deps */
import { HStack, Text, Box } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useCountdown } from 'usehooks-ts'
import { TransactionState } from '@/lib/modules/transactions/transaction-steps/lib'
import { useSwap } from './useSwap'
import { NumberText } from '@/lib/shared/components/typography/NumberText'

type Props = {
  swapTxState?: TransactionState
}

function useSwapTimeout({ swapTxState }: Props) {
  // This countdown needs to be nested here and not at a higher level, like in
  // useAddLiquidity, because otherwise it causes re-renders of the entire
  // add-liquidity flow component tree every second.
  const [secondsToRefetch, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
    countStart: 30,
    intervalMs: 1000,
  })

  const { simulationQuery, previewModalDisclosure } = useSwap()

  const isConfirmingSwap = swapTxState === TransactionState.Confirming
  const isAwaitingUserConfirmation = swapTxState === TransactionState.Loading
  const isComplete = swapTxState === TransactionState.Completed

  // Disable query refetches:
  // if the flow is complete
  // if the add liquidity transaction is confirming
  const shouldFreezeQuote = isComplete || isConfirmingSwap || isAwaitingUserConfirmation

  // When the countdown timer reaches 0, refetch all add liquidity queries.
  useEffect(() => {
    const refetchQueries = async () => {
      stopCountdown()
      resetCountdown()
      await simulationQuery.refetch()
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

  // On first render, start the countdown.
  useEffect(() => {
    stopCountdown()
    resetCountdown()
    startCountdown()
  }, [])

  return { secondsToRefetch, shouldFreezeQuote }
}

export function SwapTimeout(props: Props) {
  const { secondsToRefetch, shouldFreezeQuote } = useSwapTimeout(props)

  return (
    !shouldFreezeQuote && (
      <HStack spacing="xs" fontSize="sm" fontWeight="normal">
        <Text color="grayText">Quote refresh in</Text>
        <HStack spacing="none">
          <NumberText color="grayText" textAlign="right" fontWeight="bold">
            {secondsToRefetch}
          </NumberText>
          <Text color="grayText" fontWeight="bold">
            s
          </Text>
        </HStack>
      </HStack>
    )
  )
}
