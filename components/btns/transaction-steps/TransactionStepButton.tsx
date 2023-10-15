'use client'

import { Alert, Button, VStack } from '@chakra-ui/react'
import { TransactionStep } from './lib'
import { TransactionState } from '@/components/other/TransactionState'
import { useAccount } from 'wagmi'
import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'

interface Props {
  step: TransactionStep
}

export function TransactionStepButton({ step: { simulation, execution, result, getLabels } }: Props) {
  const { isConnected } = useAccount();

  function handleOnClick() {
    if (!simulation.isError) {
      execution.write?.()
    }
  }

  const isTransactButtonVisible = isConnected && !execution.isSuccess;
  const hasError = simulation.isError || execution.isError;

  return (
    <VStack width='full'>
      {hasError && <Alert rounded='md' status='error'>{(execution.error as any)?.shortMessage || (simulation.error as any)?.shortMessage}</Alert>}
      {execution.data?.hash && <TransactionState result={result}></TransactionState>}
      {
        !isTransactButtonVisible &&
        <ConnectWallet />
      }
      {isTransactButtonVisible && (
        <Button
          width='full'
          isDisabled={!execution.write}
          isLoading={execution.isLoading}
          onClick={handleOnClick}
        >
          {getLabels().label}
        </Button>
      )}
      {execution.isSuccess && <Button width='full' onClick={execution.reset}>Try again</Button>}
    </VStack>
  )
}
