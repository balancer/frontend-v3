'use client'

import { Alert, Button, VStack } from '@chakra-ui/react'
import { TransactionState, TransactionStep, getTransactionState } from './lib'
import { useAccount } from 'wagmi'
import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'
import { TransactionStateData } from '@/components/other/TransactionState'

interface Props {
  step: TransactionStep
}

export function TransactionStepButton({
  step: { simulation, execution, result, getLabels, managedWrite },
}: Props) {
  const { isConnected } = useAccount()
  const isTransactButtonVisible = isConnected
  const transactionState = getTransactionState({ simulation, execution, result })
  const isButtonLoading =
    transactionState === TransactionState.Loading ||
    transactionState === TransactionState.Confirming
  const hasSimulationError = !execution.write || simulation.isError
  const isButtonDisabled = transactionState === TransactionState.Loading || hasSimulationError

  function handleOnClick() {
    if (!simulation.isError) {
      managedWrite()
    }
  }

  function getButtonLabel() {
    // sensible defaults for loading / confirm if not provided
    const transactionLabels = getLabels()
    const relevantLabel = transactionLabels[transactionState]
    if (!relevantLabel) {
      switch (transactionState) {
        case TransactionState.Loading:
          return 'Confirm in wallet'
        case TransactionState.Confirming:
          return 'Confirming transaction'
        case TransactionState.Error:
          return transactionLabels.ready
      }
    }
    return relevantLabel
  }

  return (
    <VStack width="full">
      {(hasSimulationError || transactionState === TransactionState.Error) && (
        <Alert rounded="md" status="error">
          {(execution.error as any)?.shortMessage || (simulation.error as any)?.shortMessage}
        </Alert>
      )}
      {execution.data?.hash && <TransactionStateData result={result}></TransactionStateData>}
      {!isTransactButtonVisible && <ConnectWallet />}
      {isTransactButtonVisible && (
        <Button
          width="full"
          isDisabled={isButtonDisabled}
          isLoading={isButtonLoading}
          onClick={handleOnClick}
          loadingText={getButtonLabel()}
        >
          {getButtonLabel()}
        </Button>
      )}
    </VStack>
  )
}
