/* eslint-disable react-hooks/exhaustive-deps */
import { Text } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useCountdown } from 'usehooks-ts'
import { useAddLiquidity } from './useAddLiquidity'

function useAddLiquidityTimeout() {
  // This countdown needs to be nested here and not at a higher level, like in
  // useAddLiquidity, because otherwise it causes re-renders of the entire
  // add-liquidity flow component tree every second.
  const [secondsToRefetch, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
    countStart: 30,
    intervalMs: 1000,
  })

  const {
    shouldFreezeQuote,
    simulationQuery,
    priceImpactQuery,
    buildCallDataQuery,
    previewModalDisclosure,
  } = useAddLiquidity()

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

  // If the transaction flow is complete, stop the countdown timer.
  useEffect(() => {
    if (shouldFreezeQuote) {
      stopCountdown()
      resetCountdown()
    }
  }, [shouldFreezeQuote])

  // When the modal is closed the timeout should be stopped and reset.
  useEffect(() => {
    if (!previewModalDisclosure.isOpen) {
      stopCountdown()
      resetCountdown()
    }
  }, [previewModalDisclosure.isOpen])

  // On initial render, assume build is complete and start countdown.
  useEffect(() => {
    startCountdown()
  }, [])

  return { secondsToRefetch }
}

export function AddLiquidityTimeout() {
  const { secondsToRefetch } = useAddLiquidityTimeout()

  return <Text>Quote expires in: {secondsToRefetch} secs</Text>
}
