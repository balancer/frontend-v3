'use client'
import { TokenAllowancesProvider } from '@/lib/modules/web3/useTokenAllowances'
import { JoinWithTokenApproval } from './AddLiquidityUnbalanced'
import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { poolId, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { TokenBalancesProvider } from '@/lib/modules/tokens/useTokenBalances'
import { TokenBase } from '@/lib/modules/tokens/token.types'
import { AddLiquidityConfigBuilder } from '@/lib/modules/pool/actions/add-liquidity/AddLiquidityConfigBuilder'
import { ChainId, PoolStateInput } from '@balancer/sdk'
import { MockApi } from '@/lib/shared/hooks/balancer-api/MockApi'
import { HumanAmountIn } from '@/lib/modules/pool/actions/add-liquidity/add-liquidity.types'

export default function DebugPage() {
  const spenderAddress = useContractAddress('balancer.vaultV2') || emptyAddress
  const { userAddress } = useUserAccount()
  const { getToken } = useTokens()
  const poolTokenAddresses = [wETHAddress, wjAuraAddress]
  const tokens = poolTokenAddresses.map(tokenAddress => getToken(tokenAddress, 1)) as TokenBase[]

  // These two will come from the AddLiquidity form
  const poolStateInput = new MockApi().getPool(poolId) as PoolStateInput
  const humanAmountsIn: HumanAmountIn[] = [
    { humanAmount: '2', tokenAddress: wETHAddress },
    { humanAmount: '0', tokenAddress: wjAuraAddress },
  ]

  const builder = new AddLiquidityConfigBuilder(ChainId.MAINNET, poolStateInput, 'unbalanced')

  return (
    <TokenBalancesProvider tokens={tokens}>
      <TokenAllowancesProvider
        userAddress={userAddress || emptyAddress}
        spenderAddress={spenderAddress}
        tokenAddresses={poolTokenAddresses}
      >
        <JoinWithTokenApproval
          humanAmountsIn={humanAmountsIn}
          builder={builder}
        ></JoinWithTokenApproval>
      </TokenAllowancesProvider>
    </TokenBalancesProvider>
  )
}
