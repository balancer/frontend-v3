'use client'

import { Address } from 'viem'
import { useWaitForTransaction } from 'wagmi'

export function TransactionState({ hash }: { hash: Address }) {
  const { data, isError, isLoading } = useWaitForTransaction({
    hash,
  })

  if (isLoading) return <div>Processing…</div>
  if (isError) return <div>Transaction error</div>
  return <div>Gas used: {data?.gasUsed.toString()}</div>
}
