/* eslint-disable react-hooks/exhaustive-deps */
import { HStack, Text, Tooltip } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useCountdown } from 'usehooks-ts'
import { removeLiquidityStepId } from '@/lib/modules/transactions/transaction-steps/lib'
import { useRemoveLiquidity } from '../useRemoveLiquidity'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { useShouldFreezeQuote } from '@/lib/modules/transactions/transaction-steps/useShouldFreezeQuote'

function useRemoveLiquidityTimeout() {
  // This countdown needs to be nested here and not at a higher level, like in
  // useRemoveLiquidity, because otherwise it causes re-renders of the entire
  // remove-liquidity flow component tree every second.
  const [secondsToRefetch, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
    countStart: 30,
    intervalMs: 1000,
  })

  const { simulationQuery, priceImpactQuery, previewModalDisclosure } = useRemoveLiquidity()

  // Disable query refetches:
  // if the flow is complete
  // if the remove liquidity transaction is confirming
  const { shouldFreezeQuote } = useShouldFreezeQuote(removeLiquidityStepId)

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

export function RemoveLiquidityTimeout() {
  const { secondsToRefetch, shouldFreezeQuote } = useRemoveLiquidityTimeout()

  return (
    !shouldFreezeQuote && (
      <HStack justify="space-between" w="full">
        <Text fontWeight="medium" variant="secondary">
          Valid for
        </Text>
        <HStack>
          <Text color="GrayText">{secondsToRefetch} secs</Text>
          <Tooltip
            label="Quoted numbers above valid until timeout, after which they will be recalculated."
            fontSize="sm"
          >
            <InfoOutlineIcon color="GrayText" />
          </Tooltip>
        </HStack>
      </HStack>
    )
  )
}
