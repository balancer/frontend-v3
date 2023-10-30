'use client'

import { TransactionResult } from '@/lib/modules/web3/contracts/contract.types'

// Example component to illustrate how to render transaction info given a tx hash
export function TransactionStateData({ result }: { result: TransactionResult }) {
  const { data } = result
  return <div>Gas used: {data?.gasUsed.toString()}</div>
}
