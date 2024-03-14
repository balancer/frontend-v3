/* eslint-disable react-hooks/exhaustive-deps */
import { HStack, Text, Tooltip } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useCountdown } from 'usehooks-ts'
import { useAddLiquidity } from './useAddLiquidity'
import { addLiquidityStepId } from '@/lib/modules/transactions/transaction-steps/lib'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { useShouldFreezeQuote } from '@/lib/modules/transactions/transaction-steps/useShouldFreezeQuote'

function useAddLiquidityTimeout() {
  // This countdown needs to be nested here and not at a higher level, like in
  // useAddLiquidity, because otherwise it causes re-renders of the entire
  // add-liquidity flow component tree every second.
  const [secondsToRefetch, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
    countStart: 30,
    intervalMs: 1000,
  })

  const { previewModalDisclosure, refetchQuote } = useAddLiquidity()

  // Disable query refetches:
  // if the flow is complete
  // if the add liquidity transaction is confirming
  const { shouldFreezeQuote } = useShouldFreezeQuote(addLiquidityStepId)

  // When the countdown timer reaches 0, refetch all add liquidity queries.
  useEffect(() => {
    const refetchQueries = async () => {
      stopCountdown()
      resetCountdown()
      await refetchQuote()
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

  return (
    !shouldFreezeQuote && (
      <HStack justify="space-between" w="full">
        <Text>Valid for</Text>
        <HStack>
          <Text color="grayText">{secondsToRefetch} secs</Text>
          <Tooltip
            label="Quoted numbers above valid until timeout, after which they will be recalculated."
            fontSize="sm"
          >
            <InfoOutlineIcon color="grayText" />
          </Tooltip>
        </HStack>
      </HStack>
    )
  )
}
