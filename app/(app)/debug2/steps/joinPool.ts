import { TransactionStep } from '@/components/btns/transaction-steps/lib'
import {
  SdkTransactionConfig,
  UsePrepareSendTransactionConfig,
} from '@/lib/contracts/contract.types'
import { BuildTransactionLabels } from '@/lib/contracts/transactionLabels'
import { useManagedSendTransaction } from '@/lib/contracts/useManagedSendTransaction'
import { noUserAddress } from '@/lib/contracts/wagmi-helpers'
import { ChainId, JoinInput, PoolJoin, PoolStateInput, Slippage } from '@balancer/sdk'
import { useEffect, useState } from 'react'
import { Address } from 'wagmi'

export function useConstructJoinPoolStep() {
  const [txConfig, setTxConfig] = useState<UsePrepareSendTransactionConfig | null>(null)

  // update relayer approval args
  useEffect(() => {}, [])

  // if (!txConfig) return null

  const transaction = useManagedSendTransaction(txConfig)

  const step: TransactionStep = {
    ...transaction,
    getLabels: buildJoinPoolLabels,
    stepId: 'joinPool',
    isComplete: false,
  }

  return {
    step,
    // setApprovalArgs: setEthUnits,
  }
}

export const buildJoinPoolLabels: BuildTransactionLabels = () => {
  return {
    ready: 'Join pool',
    confirming: 'Confirm pool join',
    tooltip: 'bing',
    description: 'bong',
  }
}
