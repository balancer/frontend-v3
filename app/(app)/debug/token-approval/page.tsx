'use client'
import { TokenAllowancesProvider } from '@/lib/modules/web3/useTokenAllowances'
import { JoinWithTokenApproval } from './JoinWithTokenApproval'
import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'

export default function DebugPage() {
  const spenderAddress = useContractAddress('balancer.vaultV2') || emptyAddress
  const { userAddress } = useUserAccount()

  return (
    <TokenAllowancesProvider
      userAddress={userAddress || emptyAddress}
      spenderAddress={spenderAddress}
      tokenAddresses={[wETHAddress, wjAuraAddress]}
    >
      <JoinWithTokenApproval></JoinWithTokenApproval>
    </TokenAllowancesProvider>
  )
}
