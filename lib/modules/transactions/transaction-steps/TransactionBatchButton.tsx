/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { GenericError } from '@/lib/shared/components/errors/GenericError'
import { ensureError } from '@/lib/shared/utils/errors'
import { Button, VStack } from '@chakra-ui/react'
import { noop } from 'lodash'
import { useEffect, useState } from 'react'
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
  TxBatch,
  getTransactionState,
} from './lib'
import { useSmartAccountMetadata } from '../../web3/useSmartAccountMetadata'
import SafeAppsSDK, { TransactionStatus } from '@safe-global/safe-apps-sdk'
import { useOnTransactionSubmission } from '../../web3/contracts/useOnTransactionSubmission'
import { Hex } from 'viem'
import { getGqlChain } from '@/lib/config/app.config'
import { useInterval } from 'usehooks-ts'

type Props = {
  labels: TransactionLabels
  chainId: number
  txCalls: TxBatch
}
export function TransactionBatchButton({ id, labels, chainId, txCalls }: { id: string } & Props) {
  const [safeTxHash, setSafeTxHash] = useState<Hex | undefined>()
  const [txHash, setTxHash] = useState<Hex | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  // TODO: Generalize to handle switch network and other states managed in TransactionStepButton
  const [sendCallsError, setSendCallsError] = useState<Error>()

  const { isSafeWallet } = useSmartAccountMetadata()

  const safeAppsSdk = new SafeAppsSDK()

  // Probably not needed
  // const { updateTransaction } = useTransactionState()
  // useEffect(() => {
  //   if (!chainId) return
  //   updateTransaction(id, transaction)
  // }, [id, transaction])

  const transaction = buildBatchManagedResult(chainId, safeTxHash)
  const transactionState = getTransactionState(transaction)

  async function handleOnClick() {
    setSendCallsError(undefined)
    setIsLoading(true)
    try {
      console.log('Executing bundled calls', { txCalls })
      const safeTx = await safeAppsSdk.txs.send({ txs: txCalls })
      const tx = await safeAppsSdk.txs.getBySafeTxHash(safeTx.safeTxHash)

      setSafeTxHash(safeTx.safeTxHash as Hex)
    } catch (e: unknown) {
      console.log('ERROR En executeAsync batch', e)
      setIsLoading(false)
      setSendCallsError(ensureError(e))
    }
  }

  function getButtonLabel() {
    // Probably can be simplified
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

  useInterval(() => {
    //TODO: clean up this code
    if (safeTxHash && !txHash) {
      safeAppsSdk.txs.getBySafeTxHash(safeTxHash).then(tx => {
        if (tx.txHash) {
          console.log('Real tx hash for batch', { tx: tx.txHash })
          // it is possible that we need to wait for certain tx.status until the tx receipt is ready to be looked for
          setTxHash(tx.txHash as Hex)
          setIsLoading(false)
        }
        console.log('tx hash does not exist yet')
      })
    }
  }, 5000)

  // on successful submission to chain, add tx to cache
  useOnTransactionSubmission({
    labels,
    hash: txHash,
    chain: getGqlChain(chainId),
  })

  return (
    <VStack width="full">
      {sendCallsError && <TransactionError error={sendCallsError} />}
      <Button
        width="full"
        w="full"
        size="lg"
        variant="primary"
        loadingText={getButtonLabel()}
        isLoading={isLoading}
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

// We need to review this, it does not depend on the safeTxHash but on the txHash and maybe we can avoid it
function buildBatchManagedResult(chainId: number, safeTxHash?: Hex): ManagedResult {
  const status = safeTxHash ? 'success' : 'pending'
  return {
    chainId,
    simulation: { data: null, status } as unknown as TransactionSimulation,
    execution: {
      data: null,
      status: safeTxHash ? 'success' : 'pending',
    } as unknown as TransactionExecution,
    result: {
      data: null,
      status,
    } as unknown as TransactionResult, // Review if we miss something here
    executeAsync: noop,
    isSafeTxLoading: false,
  }
}
