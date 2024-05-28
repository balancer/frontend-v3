import { GqlBalancePoolAprItem, GqlPoolApr } from '../../services/api/generated/graphql'
import { useAprTooltip } from '../useAprTooltip'

const apr = {
  __typename: 'GqlPoolApr',
  hasRewardApr: true,
  thirdPartyApr: {
    __typename: 'GqlPoolAprRange',
    min: '0',
    max: '0',
  },
  nativeRewardApr: {
    __typename: 'GqlPoolAprRange',
    min: '0.006170657675830251',
    max: '0.01542664418957563',
  },
  swapApr: '0.000350284482429801',
  apr: {
    __typename: 'GqlPoolAprRange',
    min: '0.02030913402973963',
    max: '0.02956512054348501',
  },
  items: [
    {
      __typename: 'GqlBalancePoolAprItem',
      id: '0x05ff47afada98a98982113758878f9a8b9fdda0a000000000000000000000645-weETH-yield-apr',
      title: 'weETH APR',
      apr: {
        __typename: 'GqlPoolAprTotal',
        total: '0.007535148019485108',
      },
      subItems: [],
    },
    {
      __typename: 'GqlBalancePoolAprItem',
      id: '0x05ff47afada98a98982113758878f9a8b9fdda0a000000000000000000000645-rETH-yield-apr',
      title: 'rETH APR',
      apr: {
        __typename: 'GqlPoolAprTotal',
        total: '0.006253043851994472',
      },
      subItems: [],
    },
    {
      __typename: 'GqlBalancePoolAprItem',
      id: '0xc859bf9d7b8c557bbd229565124c2c09269f3aef-BAL-apr',
      title: 'BAL reward APR',
      apr: {
        __typename: 'GqlPoolAprRange',
        min: '0.006170657675830251',
        max: '0.01542664418957563',
      },
      subItems: [],
    },
    {
      __typename: 'GqlBalancePoolAprItem',
      id: '0x05ff47afada98a98982113758878f9a8b9fdda0a000000000000000000000645-swap-apr',
      title: 'Swap fees APR',
      apr: {
        __typename: 'GqlPoolAprTotal',
        total: '0.000350284482429801',
      },
      subItems: [],
    },
  ],
} as GqlPoolApr

const aprItems = [
  {
    __typename: 'GqlBalancePoolAprItem',
    id: '0x05ff47afada98a98982113758878f9a8b9fdda0a000000000000000000000645-weETH-yield-apr',
    title: 'weETH APR',
    apr: {
      __typename: 'GqlPoolAprTotal',
      total: '0.007535148019485108',
    },
    subItems: [],
  },
  {
    __typename: 'GqlBalancePoolAprItem',
    id: '0x05ff47afada98a98982113758878f9a8b9fdda0a000000000000000000000645-rETH-yield-apr',
    title: 'rETH APR',
    apr: {
      __typename: 'GqlPoolAprTotal',
      total: '0.006253043851994472',
    },
    subItems: [],
  },
  {
    __typename: 'GqlBalancePoolAprItem',
    id: '0xc859bf9d7b8c557bbd229565124c2c09269f3aef-BAL-apr',
    title: 'BAL reward APR',
    apr: {
      __typename: 'GqlPoolAprRange',
      min: '0.006170657675830251',
      max: '0.01542664418957563',
    },
    subItems: [],
  },
  {
    __typename: 'GqlBalancePoolAprItem',
    id: '0x05ff47afada98a98982113758878f9a8b9fdda0a000000000000000000000645-swap-apr',
    title: 'Swap fees APR',
    apr: {
      __typename: 'GqlPoolAprTotal',
      total: '0.000350284482429801',
    },
    subItems: [],
  },
] as GqlBalancePoolAprItem[]

const vebalBoost = undefined

export const aprTooltipDataMock2 = { aprItems, apr, vebalBoost } as Parameters<
  typeof useAprTooltip
>[0]
