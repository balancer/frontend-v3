'use client'

import { Alert, Button, VStack } from '@chakra-ui/react'
import { TransactionStep, getTransactionState } from './lib'
import { useAccount } from 'wagmi'
import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'
import { TransactionStateData } from '@/components/other/TransactionState'

interface Props {
  step: TransactionStep
}

export function TransactionStepButton({ step: { simulation, execution, result, getLabels, managedWrite } }: Props) {
  const { isConnected } = useAccount();

  function handleOnClick() {
    if (!simulation.isError) {
      managedWrite();
    }
  }

  const isTransactButtonVisible = isConnected && !execution.isSuccess;
  const hasError = simulation.isError || execution.isError;
  const transactionState = getTransactionState({ simulation, execution, result });

  console.log('state', transactionState);

  return (
    <VStack width='full'>
      {hasError && <Alert rounded='md' status='error'>{(execution.error as any)?.shortMessage || (simulation.error as any)?.shortMessage}</Alert>}
      {execution.data?.hash && <TransactionStateData result={result}></TransactionStateData>}
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
