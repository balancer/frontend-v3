'use client'

import { Alert, Button, VStack } from '@chakra-ui/react'
import { TransactionState, TransactionStep, getTransactionState } from './lib'
import { useAccount } from 'wagmi'
import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'
import { TransactionStateData } from '@/components/other/TransactionState'
import { useState } from 'react'
import { useEffect } from 'react'

interface Props {
  step: TransactionStep
}

const BUTTON_LABEL_DEFAULTS: Record<TransactionState, string> = {
  [TransactionState.Loading]: 'Confirm in wallet',
  [TransactionState.Confirming]: 'Confirming transaction',
  [TransactionState.Error]: 'IMPLEMENT LABEL',
  [TransactionState.Ready]: 'IMPLEMENT LABEL',
}

export default function TransactionStepButton({
  step: { simulation, execution, result, getLabels, managedWrite },
}: Props) {
  const { isConnected, isConnecting } = useAccount()
  const [isTransactButtonVisible, setIsTransactionButtonVisible] = useState(false)

  const transactionState = getTransactionState({ simulation, execution, result })
  const isButtonLoading =
    transactionState === TransactionState.Loading ||
    transactionState === TransactionState.Confirming
  const hasSimulationError = (!execution.write && !execution.isIdle) || simulation.isError
  const isButtonDisabled = transactionState === TransactionState.Loading || hasSimulationError
  const transactionLabels = getLabels()
  const currentButtonLabel =
    transactionLabels[transactionState] || BUTTON_LABEL_DEFAULTS[transactionState]

  function handleOnClick() {
    if (!simulation.isError) {
      managedWrite()
    }
  }

  useEffect(() => {
    setIsTransactionButtonVisible(isConnected && !isConnecting)
  }, [isConnected, isConnecting])

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
        >
          {currentButtonLabel}
        </Button>
      )}
    </VStack>
  )
}
