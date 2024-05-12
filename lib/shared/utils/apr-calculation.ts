import { sortBy } from 'lodash'
import {
  GqlBalancePoolAprItem,
  GqlPoolApr,
  GqlPoolAprValue,
} from '../services/api/generated/graphql'
import { bn, fNum } from './numbers'

export function absMaxApr(apr: GqlPoolApr, boost?: number) {
  if (apr.apr.__typename === 'GqlPoolAprRange') {
    if (boost && boost > 1 && apr.nativeRewardApr.__typename === 'GqlPoolAprRange') {
      const boostedNativeRewardApr = bn(apr.nativeRewardApr.min).times(boost)
      return bn(apr.apr.min).minus(apr.nativeRewardApr.min).plus(boostedNativeRewardApr)
    }

    return apr.apr.max
  }

  // should it?
  throw new Error('absMaxApr should be used only with ranged APRs')
}

export function getMaxMinTotalApr(apr: GqlPoolApr, boost?: number) {
  let minApr = ''
  let maxApr = ''
  let singleApr = ''
  let label = ''

  if (apr.apr.__typename === 'GqlPoolAprRange') {
    minApr = fNum('apr', apr.apr.min)

    const maxRangeApr = absMaxApr(apr, boost).toString()
    maxApr = fNum('apr', maxRangeApr)

    label = `${minApr} - ${maxApr}`
  }

  if (apr.apr.__typename === 'GqlPoolAprTotal') {
    singleApr = fNum('apr', apr.apr.total)
    label = singleApr
  } else {
    singleApr = ''
  }

  return {
    minApr,
    maxApr,
    singleApr,
    label,
  }
}

export function getApr(apr: GqlPoolAprValue) {
  let minApr = ''
  let maxApr = ''
  let singleApr = ''
  if (apr.__typename === 'GqlPoolAprRange') {
    minApr = fNum('apr', apr.min)
    maxApr = fNum('apr', apr.max)
  }

  if (apr.__typename === 'GqlPoolAprTotal') {
    singleApr = fNum('apr', apr.total)
  } else {
    singleApr = ''
  }

  return {
    minApr,
    maxApr,
    singleApr,
  }
}

export const balAprTitle = 'BAL reward APR'
export const swapFeesTitle = 'Swap fees APR'

export function getBalApr(aprItems: GqlBalancePoolAprItem[]) {
  return aprItems.find(item => item.title === balAprTitle)
}

export function getSecondaryAprItems(aprItems: GqlBalancePoolAprItem[]) {
  return sortBy(
    aprItems.filter(item => ![balAprTitle, swapFeesTitle].includes(item.title)),
    'title'
  )
}

export function getSwapFeesApr(aprItems: GqlBalancePoolAprItem[]) {
  return aprItems.find(item => item.title === swapFeesTitle)
}

export function sortAprItems(aprItems: GqlBalancePoolAprItem[]) {
  const balApr = aprItems.find(item => item.title === balAprTitle)
  const swapApr = aprItems.find(item => item.title === swapFeesTitle)
  const aprItemsSortedWithoutBalAndSwap = sortBy(
    aprItems.filter(item => ![balAprTitle, swapFeesTitle].includes(item.title)),
    'title'
  )

  return [balApr, ...aprItemsSortedWithoutBalAndSwap, swapApr].filter(
    Boolean
  ) as GqlBalancePoolAprItem[]
}
