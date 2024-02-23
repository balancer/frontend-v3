/* eslint-disable react-hooks/exhaustive-deps */
import { HStack, Text, Tooltip } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useCountdown } from 'usehooks-ts'
import { useAddLiquidity } from './useAddLiquidity'
import { TransactionState } from '@/lib/shared/components/btns/transaction-steps/lib'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { requiresProportionalInput } from '../LiquidityActionHelpers'
import { usePool } from '../../usePool'

type Props = {
  addLiquidityTxState?: TransactionState
}

function useAddLiquidityTimeout({ addLiquidityTxState }: Props) {
  // This countdown needs to be nested here and not at a higher level, like in
  // useAddLiquidity, because otherwise it causes re-renders of the entire
  // add-liquidity flow component tree every second.
  const [secondsToRefetch, { startCountdown, stopCountdown, resetCountdown }] = useCountdown({
    countStart: 30,
    intervalMs: 1000,
  })

  const { simulationQuery, priceImpactQuery, previewModalDisclosure } = useAddLiquidity()
  const { pool, refetch: refetchPool } = usePool()

  const isConfirmingAddLiquidity = addLiquidityTxState === TransactionState.Confirming
  const isAwaitingUserConfirmation = addLiquidityTxState === TransactionState.Loading
  const isComplete = addLiquidityTxState === TransactionState.Completed

  // Disable query refetches:
  // if the flow is complete
  // if the add liquidity transaction is confirming
  const shouldFreezeQuote = isComplete || isConfirmingAddLiquidity || isAwaitingUserConfirmation

  // When the countdown timer reaches 0, refetch all add liquidity queries.
  useEffect(() => {
    const refetchQueries = async () => {
      stopCountdown()
      resetCountdown()
      const refetchPromises: Promise<any>[] = [
        simulationQuery.refetch(),
        priceImpactQuery.refetch(),
      ]
      if (requiresProportionalInput(pool.type)) {
        /*
          This is the only edge-case where the SDK needs pool onchain data from the frontend
          (calculateProportionalAmounts uses pool.dynamicData.totalShares in its parameters)
          so we must refetch pool data
        */
        refetchPromises.push(refetchPool())
      }
      await Promise.all(refetchPromises)
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
