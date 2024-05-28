import { GqlBalancePoolAprItem, GqlPoolApr } from '../../services/api/generated/graphql'
import { useAprTooltip } from '../useAprTooltip'

const apr = {
  apr: {
    __typename: 'GqlPoolAprRange',
    min: '0.02555172960709408',
    max: '0.052525822936565984',
  },
  hasRewardApr: true,
  thirdPartyApr: {
    __typename: 'GqlPoolAprRange',
    min: '0',
    max: '0',
  },
  nativeRewardApr: {
    __typename: 'GqlPoolAprRange',
    min: '0.0179827288863146',
    max: '0.04495682221578651',
  },
  swapApr: '0.000007489453040656273',
  items: [
    {
      title: 'rETH APR',
      apr: {
        total: '0.007561511267738821',
      },
    },
    {
      title: 'BAL reward APR',
      apr: {
        min: '0.0179827288863146',
        max: '0.04495682221578651',
      },
    },
    {
      title: 'Swap fees APR',
      apr: {
        total: '0.000007489453040656273',
      },
    },
  ],
} as Partial<GqlPoolApr>

const aprItems = [
  {
    title: 'rETH APR',
    apr: {
      total: '0.007561511267738821',
    },
  },
  {
    title: 'BAL reward APR',
    apr: {
      __typename: 'GqlPoolAprRange',
      min: '0.0179827288863146',
      max: '0.04495682221578651',
    },
  },
  {
    title: 'Swap fees APR',
    apr: {
      total: '0.000007489453040656273',
    },
  },
] as Partial<GqlBalancePoolAprItem>[]

const vebalBoost = undefined

export const aprTooltipDataMock1 = { aprItems, apr, vebalBoost } as Parameters<
  typeof useAprTooltip
>[0]
