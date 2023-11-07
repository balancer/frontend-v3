import { wETHAddress } from '@/lib/debug-helpers'
import { GqlChain, GqlUserPoolBalance } from '@/lib/shared/services/api/generated/graphql'

export function aUserBalanceMock(...options: Partial<GqlUserPoolBalance>[]): GqlUserPoolBalance {
  const defaultBalance: GqlUserPoolBalance = {
    chain: GqlChain.Mainnet,
    poolId: 'test pool id',
    tokenAddress: wETHAddress,
    tokenPrice: 0,
    totalBalance: '0',
    walletBalance: '0',
    stakedBalance: '0',
  }
  return Object.assign({}, defaultBalance, ...options)
}
