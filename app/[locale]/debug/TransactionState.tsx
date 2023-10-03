'use client'

import { useWaitForTransaction } from 'wagmi'

// Example component to illustrate how to render transaction info given a tx hash
export function TransactionState({ result }: { result: ReturnType<typeof useWaitForTransaction> }) {
  const { data } = result;
  return <div>Gas used: {data?.gasUsed.toString()}</div>
}
