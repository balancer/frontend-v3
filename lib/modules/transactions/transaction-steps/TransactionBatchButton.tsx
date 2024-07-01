/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { GenericError } from '@/lib/shared/components/errors/GenericError'
import { ensureError } from '@/lib/shared/utils/errors'
import { Button, VStack } from '@chakra-ui/react'
import { noop } from 'lodash'
import { useEffect, useState } from 'react'
import { UseSendCallsReturnType, useSendCalls } from 'wagmi/experimental'
import {
  TransactionExecution,
  TransactionResult,
  TransactionSimulation,
} from '../../web3/contracts/contract.types'
import { useTransactionState } from './TransactionStateProvider'
import {
  ManagedResult,
  TransactionLabels,
  TransactionState,
  TxCall,
  getTransactionState,
} from './lib'
import { useSmartAccountMetadata } from '../../web3/useSmartAccountMetadata'

type Props = {
  labels: TransactionLabels
  chainId: number
  txCalls: TxCall[]
}
export function TransactionBatchButton({ id, labels, chainId, txCalls }: { id: string } & Props) {
  // TODO: Generalize to handle switch network and other states managed in TransactionStepButton
  const [sendCallsError, setSendCallsError] = useState<Error>()

  const { isSafeWallet } = useSmartAccountMetadata()

  const sendCalls = useSendCalls()
  const { updateTransaction } = useTransactionState()

  const transaction = buildBatchManagerResult(chainId, sendCalls)
  const transactionState = getTransactionState(transaction)

  useEffect(() => {
    const chainId = sendCalls.variables?.chainId
    if (!chainId) return
    updateTransaction(id, transaction)
  }, [id, sendCalls.status])

  const executeAsync = async () => {
    console.log('Running sendCallsAsync', { txCalls })
    const result = await sendCalls.sendCallsAsync({
      chainId,
      calls: txCalls,
    })
    console.log('Result of sendCallsAsync', result)
  }

  async function handleOnClick() {
    setSendCallsError(undefined)
    try {
      await executeAsync?.()
    } catch (e: unknown) {
      setSendCallsError(ensureError(e))
    }
  }

  function getButtonLabel() {
    if (sendCallsError) return labels.init
    const relevantLabel = labels[transactionState as keyof typeof labels]
    if (!relevantLabel) {
      switch (transactionState) {
        case TransactionState.Preparing:
          return 'Preparing'
        case TransactionState.Loading:
          return 'Confirm in smart account wallet'
        case TransactionState.Confirming:
          return 'Confirming transaction'
        case TransactionState.Error:
          return labels.init
        case TransactionState.Completed:
          return labels.confirmed || 'Confirmed transaction'
      }
    }

    return relevantLabel
  }

  return (
    <VStack width="full">
      {isSafeWallet && <div>SAFE WALLET DETECTED</div>}
      {sendCalls.error && <TransactionError error={sendCalls.error} />}
      <div>sendCalls status: {sendCalls.status} </div>
      <Button
        width="full"
        w="full"
        size="lg"
        variant="primary"
        loadingText={getButtonLabel()}
        isLoading={sendCalls.isPending}
        onClick={handleOnClick}
      >
        {getButtonLabel()}
      </Button>
    </VStack>
  )
}

type ErrorProps = { error: Error }
export function TransactionError({ error }: ErrorProps) {
  if (error.message.includes('User rejected transaction')) return null
  return <GenericError error={error} />
}

function buildBatchManagerResult(
  chainId: number,
  useSendCallsReturnType: UseSendCallsReturnType
): ManagedResult {
  return {
    chainId,
    simulation: { data: null, status: 'success' } as unknown as TransactionSimulation,
    execution: useSendCallsReturnType as unknown as TransactionExecution,
    result: {
      data: null,
      status: useSendCallsReturnType.isSuccess ? 'success' : 'pending',
    } as unknown as TransactionResult, // Review if we miss something here
    executeAsync: noop,
  }
}
