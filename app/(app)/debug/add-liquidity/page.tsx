'use client'
import { TokenAllowancesProvider } from '@/lib/modules/web3/useTokenAllowances'
import { JoinWithTokenApproval } from './AddLiquidityUnbalanced'
import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'
import { TokenBase } from '@/lib/modules/tokens/token.types'

export default function DebugPage() {
  const spenderAddress = useContractAddress('balancer.vaultV2') || emptyAddress
  const { userAddress } = useUserAccount()
  const { getToken } = useTokens()
  const poolTokenAddresses = [wETHAddress, wjAuraAddress]
  const tokens = poolTokenAddresses.map(tokenAddress => getToken(tokenAddress, 1)) as TokenBase[]

  return (
    <TokenBalancesProvider tokens={tokens}>
      <TokenAllowancesProvider
        userAddress={userAddress || emptyAddress}
        spenderAddress={spenderAddress}
        tokenAddresses={poolTokenAddresses}
      >
        <JoinWithTokenApproval></JoinWithTokenApproval>
      </TokenAllowancesProvider>
    </TokenBalancesProvider>
  )
}
