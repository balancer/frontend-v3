'use client'

import { ConnectWallet } from '@/lib/modules/web3/ConnectWallet'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { Button, VStack } from '@chakra-ui/react'
import { FlowStep, TransactionState, getTransactionState } from './lib'
import { useChainSwitch } from '@/lib/modules/web3/useChainSwitch'
import { SupportedChainId } from '@/lib/config/config.types'
import { GenericError } from '@/lib/shared/components/errors/GenericError'
import { getGqlChain } from '@/lib/config/app.config'
import { TransactionTimeoutError } from '@/lib/shared/components/errors/TransactionTimeoutError'

interface Props {
  step: FlowStep
}

export function TransactionStepButton({ step }: Props) {
  const { simulation, execution, result, transactionLabels, execute: managedRun } = step
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
      {transactionState === TransactionState.Error && <TransactionError step={step} />}
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

function TransactionError({ step }: Props) {
  if (step.simulation.error) {
    return <GenericError error={step.simulation.error} />
  }
  if (step.execution.error) {
    return <GenericError error={step.execution.error} />
  }
  const resultError = step.result.error
  if (resultError) {
    const isTimeoutError = resultError.name === 'WaitForTransactionReceiptTimeoutError'
    const transactionHash = step.execution.data?.hash
    if (isTimeoutError && transactionHash) {
      const chain = getGqlChain(step.simulation.config.chainId || 1)
      return <TransactionTimeoutError chain={chain} transactionHash={transactionHash} />
    }
    return <GenericError error={resultError} />
  }

  return null
}
