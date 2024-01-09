import { GqlPoolUserBalance } from '@/lib/shared/services/api/generated/graphql'

export function aUserPoolBalance(...options: Partial<GqlPoolUserBalance>[]): GqlPoolUserBalance {
  const defaultBalance: GqlPoolUserBalance = {
    __typename: 'GqlPoolUserBalance',
    stakedBalance: '50',
    stakedBalanceUsd: 50,
    totalBalance: '100',
    totalBalanceUsd: 100,
    walletBalance: '100',
    walletBalanceUsd: 100,
  }

  return Object.assign({}, defaultBalance, ...options)
}
