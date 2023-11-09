'use client'
import { TokenAllowancesProvider } from '@/lib/modules/web3/useTokenAllowances'
import { JoinWithTokenApproval } from './JoinWithTokenApproval'

export default function DebugPage() {
  return (
    <TokenAllowancesProvider>
      <JoinWithTokenApproval></JoinWithTokenApproval>
    </TokenAllowancesProvider>
  )
}
