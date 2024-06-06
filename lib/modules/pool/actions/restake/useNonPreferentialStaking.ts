import { bn } from '@/lib/shared/utils/numbers'
import { Pool } from '../../PoolProvider'

//TODO: rename to usePoolUserBalances
export function useNonPreferentialStaking(pool: Pool) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const nonPreferentialStakedBalance = bn(pool.userBalance?.nonPreferentialStakedBalance || '0')

  const hasNonPreferentialStakedBalance = nonPreferentialStakedBalance.gt(0)

  const nonPreferentialGaugeAddress = pool.staking?.gauge?.otherGauges?.[0]?.gaugeAddress || ''

  return {
    hasNonPreferentialStakedBalance,
    nonPreferentialStakedBalance: nonPreferentialStakedBalance.toFixed(),
    userBalance: pool.userBalance,
    nonPreferentialGaugeAddress,
  }
}
