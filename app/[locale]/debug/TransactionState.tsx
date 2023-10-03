'use client'

import { Address } from 'viem'
import { useWaitForTransaction } from 'wagmi'

// Example component to illustrate how to render transaction info given a tx hash
export function TransactionState({ hash }: { hash: Address }) {
  const { data } = useWaitForTransaction({
    hash,
  })

  return <div>Gas used: {data?.gasUsed.toString()}</div>
}
