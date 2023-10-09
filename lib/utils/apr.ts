import numeral from 'numeral'
import { GqlPoolAprValue } from '@/lib/services/api/generated/graphql'

const formatApr = (apr: string) => {
  if (parseFloat(apr) < 0.0000001) {
    return '0%'
  }

  return numeral(apr).format('0.[00]%')
}

export function getApr(apr: GqlPoolAprValue): string {
  if (apr.__typename === 'GqlPoolAprRange') {
    return `${formatApr(apr.min)} - ${formatApr(apr.max)}`
  } else if (apr.__typename === 'GqlPoolAprTotal') {
    return formatApr(apr.total)
  } else {
    return '-'
  }
}
