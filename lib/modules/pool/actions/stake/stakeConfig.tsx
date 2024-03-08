/* eslint-disable react-hooks/exhaustive-deps */
import { StepConfig } from '../useIterateSteps'
import { TransactionStepButton } from '@/lib/modules/transactions/transaction-steps/TransactionStepButton'
import { useEffect, useState } from 'react'
import { usePool } from '../../usePool'
import { Button, VStack } from '@chakra-ui/react'
import { usePoolRedirect } from '../../pool.hooks'
import { useConstructStakingDepositActionStep } from '../../../staking/staking.actions'
import { useStaking } from './useStaking'

export const stakeConfig: StepConfig = {
  title: 'Stake',
  render() {
    return <StakeButton />
  },
}

function StakeButton() {
  const [didRefetchPool, setDidRefetchPool] = useState(false)
  const { refetch, pool, chainId } = usePool()
  const { rawAmount } = useStaking()
  const { redirectToPoolPage } = usePoolRedirect(pool)

  const stakeStep = useConstructStakingDepositActionStep(chainId, pool.staking, rawAmount)

  const isComplete = stakeStep.isComplete()

  useEffect(() => {
    async function reFetchPool() {
      await refetch()
      setDidRefetchPool(true)
    }
    if (isComplete) reFetchPool()
  }, [isComplete])

  async function handlerRedirectToPoolPage(event: React.MouseEvent<HTMLElement>) {
    redirectToPoolPage(event)
  }

  return (
    <VStack w="full">
      {!isComplete && <TransactionStepButton step={stakeStep}></TransactionStepButton>}
      {isComplete && (
        <Button w="full" size="lg" onClick={handlerRedirectToPoolPage} isLoading={!didRefetchPool}>
          Return to pool
        </Button>
      )}
    </VStack>
  )
}
