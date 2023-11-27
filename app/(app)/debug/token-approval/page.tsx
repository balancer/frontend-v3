'use client'
import { TokenAllowancesProvider } from '@/lib/modules/web3/useTokenAllowances'
import { JoinWithTokenApproval } from './JoinWithTokenApproval'
import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'

export default function DebugPage() {
  const spenderAddress = useContractAddress('balancer.vaultV2') || emptyAddress
  const { userAddress } = useUserAccount()
  const { getTokensByChain } = useTokens()

  return (
    <TokenBalancesProvider tokens={getTokensByChain(1)}>
      <TokenAllowancesProvider
        userAddress={userAddress || emptyAddress}
        spenderAddress={spenderAddress}
        tokenAddresses={[wETHAddress, wjAuraAddress]}
      >
        <JoinWithTokenApproval></JoinWithTokenApproval>
      </TokenAllowancesProvider>
    </TokenBalancesProvider>
  )
}
