'use client'

import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { Alert, Button, VStack } from '@chakra-ui/react'
import { FlowStep, TransactionState, getTransactionState } from './lib'
import { useChainSwitch } from '@/lib/modules/web3/useChainSwitch'
import { SupportedChainId } from '@/lib/config/config.types'

interface Props {
  step: FlowStep
}

export function TransactionStepButton({
  step: { simulation, execution, result, transactionLabels, execute: managedRun },
}: Props) {
  const { isConnected } = useUserAccount()
  const { shouldChangeNetwork, NetworkSwitchButton, networkSwitchButtonProps } = useChainSwitch(
    simulation.config.chainId as SupportedChainId
  )
  const isTransactButtonVisible = isConnected
  const transactionState = getTransactionState({ simulation, execution, result })
  const isButtonLoading =
    transactionState === TransactionState.Loading ||
    transactionState === TransactionState.Confirming
  const hasSimulationError = simulation.isError
  const isIdle = isConnected && simulation.isIdle && !simulation.data
  const isButtonDisabled =
    transactionState === TransactionState.Loading || hasSimulationError || isIdle

  function handleOnClick() {
    if (!simulation.isError) {
      managedRun?.()
    }
  }

  function getButtonLabel() {
    // sensible defaults for loading / confirm if not provided
    const relevantLabel = transactionLabels[transactionState as keyof typeof transactionLabels]

    if (!relevantLabel) {
      switch (transactionState) {
        case TransactionState.Preparing:
          return 'Preparing'
        case TransactionState.Loading:
          return 'Confirm in wallet'
        case TransactionState.Confirming:
          return 'Confirming transaction'
        case TransactionState.Error:
          return transactionLabels.init
        case TransactionState.Completed:
          return transactionLabels.init
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
      {!isTransactButtonVisible && <ConnectWallet />}
      {shouldChangeNetwork && isTransactButtonVisible && (
        <NetworkSwitchButton {...networkSwitchButtonProps} />
      )}
      {!shouldChangeNetwork && isTransactButtonVisible && (
        <Button
          width="full"
          w="full"
          size="lg"
          variant="primary"
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
