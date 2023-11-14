'use client'
import { TokenAllowancesProvider } from '@/lib/modules/web3/useTokenAllowances'
import { NativeAssetJoin } from './NativeAssetJoin'

export default function DebugPage() {
  return (
    <TokenAllowancesProvider>
      <NativeAssetJoin></NativeAssetJoin>
    </TokenAllowancesProvider>
  )
}
