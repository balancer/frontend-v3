'use client'

import { AddLiquidityReceipt } from '@/lib/modules/pool/actions/add-liquidity/AddLiquidityReceipt'
import { Hash } from 'viem'

// ../layout.tsx defines UI and state that is shared by this page and the root /add-liquidity page
export default function AddLiquidityReceiptPage({
  params: { txHash },
}: {
  params: { txHash: string }
}) {
  return <AddLiquidityReceipt txHash={txHash as Hash} />
}
