import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import {
  GqlPoolStakingType,
  GqlPoolUserBalance,
  GqlUserStakedBalance,
} from '@/lib/shared/services/api/generated/graphql'
import {
  calcNonGaugeStakedBalance,
  calcRawStakedBalance,
  calcRawTotalBalance,
  calcRawWalletBalance,
  calcStakedBalance,
  calcStakedBalanceUsd,
  calcTotalBalance,
  calcTotalBalanceUsd,
  calcWalletBalance,
  calcWalletBalanceUsd,
} from './userBalance.helpers'

const apiStakedBalances: GqlUserStakedBalance[] = [
  {
    balance: '0',
    balanceUsd: 0,
    stakingType: GqlPoolStakingType.Gauge,
    stakingId: '0xe99a452a65e5bb316febac5de83a1ca59f6a3a94', //Preferential gauge
    __typename: 'GqlUserStakedBalance',
  },
  {
    balance: '52.123',
    balanceUsd: 7.9,
    stakingType: GqlPoolStakingType.Gauge,
    stakingId: '0x55ec14e951b1c25ab09132dae12363bea0d20105', //Non preferential gauge
    __typename: 'GqlUserStakedBalance',
  },
  {
    balance: '22',
    balanceUsd: 50,
    stakingType: GqlPoolStakingType.Aura,
    stakingId: '',
    __typename: 'GqlUserStakedBalance',
  },
]

test('Calculates pool totals', () => {
  const pool = aWjAuraWethPoolElementMock()
  const userBalanceMock: GqlPoolUserBalance = {
    __typename: 'GqlPoolUserBalance',
    walletBalance: '100',
    walletBalanceUsd: 200,
    totalBalance: '175',
    totalBalanceUsd: 300,
    stakedBalances: apiStakedBalances,
  }
  pool.userBalance = userBalanceMock

  expect(calcTotalBalance(pool)).toBe('175')
  expect(calcTotalBalanceUsd(pool)).toBe(300)
  expect(calcRawTotalBalance(pool)).toBe(175000000000000000000n)

  expect(calcStakedBalance(pool)).toBe('74.123') // (preferential staked + non-preferential staked + aura staked) = 0 + 52.123 + 22
  expect(calcStakedBalanceUsd(pool)).toBe(57.9)
  expect(calcRawStakedBalance(pool)).toBe(74123000000000000000n)

  expect(calcWalletBalance(pool)).toBe('100')
  expect(calcWalletBalanceUsd(pool)).toBe(200)
  expect(calcRawWalletBalance(pool)).toBe(100000000000000000000n)

  expect(calcNonGaugeStakedBalance(pool)).toBe(22) // aura staked
})
