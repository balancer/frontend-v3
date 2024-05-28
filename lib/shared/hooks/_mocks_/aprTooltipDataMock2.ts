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
    min: '0.01227364307382197',
    max: '0.03068410768455493',
  },
  swapApr: '0.0002217078418900592',
  apr: {
    __typename: 'GqlPoolAprRange',
    min: '0.02313540147234497',
    max: '0.04154586608307793',
  },
  items: [
    {
      __typename: 'GqlBalancePoolAprItem',
      id: '0x27519f69b2ac912aeb6fe066180fb25a17c71755-BAL-apr',
      title: 'BAL reward APR',
      apr: {
        __typename: 'GqlPoolAprRange',
        min: '0.01227364307382197',
        max: '0.03068410768455493',
      },
      subItems: [],
    },
    {
      __typename: 'GqlBalancePoolAprItem',
      id: '0xbad20c15a773bf03ab973302f61fabcea5101f0a000000000000000000000034-wstETH-yield-apr',
      title: 'wstETH APR',
      apr: {
        __typename: 'GqlPoolAprTotal',
        total: '0.01064005055663294',
      },
      subItems: [],
    },
    {
      __typename: 'GqlBalancePoolAprItem',
      id: '0xbad20c15a773bf03ab973302f61fabcea5101f0a000000000000000000000034-swap-apr',
      title: 'Swap fees APR',
      apr: {
        __typename: 'GqlPoolAprTotal',
        total: '0.0002217078418900592',
      },
      subItems: [],
    },
  ],
} as GqlPoolApr

const aprItems = [
  {
    __typename: 'GqlBalancePoolAprItem',
    id: '0x27519f69b2ac912aeb6fe066180fb25a17c71755-BAL-apr',
    title: 'BAL reward APR',
    apr: {
      __typename: 'GqlPoolAprRange',
      min: '0.01227364307382197',
      max: '0.03068410768455493',
    },
    subItems: [],
  },
  {
    __typename: 'GqlBalancePoolAprItem',
    id: '0xbad20c15a773bf03ab973302f61fabcea5101f0a000000000000000000000034-wstETH-yield-apr',
    title: 'wstETH APR',
    apr: {
      __typename: 'GqlPoolAprTotal',
      total: '0.01064005055663294',
    },
    subItems: [],
  },
  {
    __typename: 'GqlBalancePoolAprItem',
    id: '0xbad20c15a773bf03ab973302f61fabcea5101f0a000000000000000000000034-swap-apr',
    title: 'Swap fees APR',
    apr: {
      __typename: 'GqlPoolAprTotal',
      total: '0.0002217078418900592',
    },
    subItems: [],
  },
] as GqlBalancePoolAprItem[]

const vebalBoost = undefined

export const aprTooltipDataMock2 = { aprItems, apr, vebalBoost } as Parameters<
  typeof useAprTooltip
>[0]
