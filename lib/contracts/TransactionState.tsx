'use client'

import { useWaitForTransaction } from 'wagmi'
import { TransactionResult } from './contract.types'

export function TransactionState({ hash }: TransactionResult) {
  const { data, isError, isLoading } = useWaitForTransaction({
    hash,
  })

  if (isLoading) return <div>Processing…</div>
  if (isError) return <div>Transaction error</div>
  return <div>Gas used: {data?.gasUsed.toString()}</div>
}
