import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { useMemo } from 'react'
import { bn } from '@/lib/shared/utils/numbers'
import { isUndefined } from 'lodash'
import { useGaugesSupplyAndBalance } from './useGaugesSupplyAndBalance'
import { useVebalLockInfo } from './useVebalLockInfo'
import { useGaugeTotalSupplyAndUserBalance } from './useGaugeTotalSupplyAndUserBalance'

export type VeBalLockInfo = {
  lockedEndDate: number
  lockedAmount: string
  totalSupply: string
  epoch: string
  hasExistingLock: boolean
  isExpired: boolean
}

export interface GaugeArg {
  chain: GqlChain
  gaugeAddress: string
  poolId: string
}

function calcUserBoost({
  userGaugeBalance,
  gaugeTotalSupply,
  userVeBALBalance,
  veBALTotalSupply,
}: {
  userGaugeBalance: string
  gaugeTotalSupply: string
  userVeBALBalance: string
  veBALTotalSupply: string
}): string {
  const _userGaugeBalance = bn(userGaugeBalance)
  const _gaugeTotalSupply = bn(gaugeTotalSupply)
  const _userVeBALBalance = bn(userVeBALBalance)
  const _veBALTotalSupply = bn(veBALTotalSupply)
  const boost = bn(1).plus(
    bn(1.5)
      .times(_userVeBALBalance)
      .div(_veBALTotalSupply)
      .times(_gaugeTotalSupply)
      .div(_userGaugeBalance)
  )
  const minBoost = bn(2.5).lt(boost) ? 2.5 : boost

  return minBoost.toString()
}

export function useVebalBoost(gauges: GaugeArg[]) {
  const { mainnetLockedInfo } = useVebalLockInfo()
  const { veBalTotalSupplyL2, userVeBALBalances } = useGaugeTotalSupplyAndUserBalance(gauges)

  const { gaugeDataByPoolMap } = useGaugesSupplyAndBalance(gauges)

  const calcedBoostsByPool = useMemo(() => {
    return Object.entries(gaugeDataByPoolMap).reduce(
      (acc, [poolId, { totalSupply, userBalance, gauge }]) => {
        const userVeBALChainBalance = userVeBALBalances.results?.[gauge.chain]?.data as any

        const vebalBalance = userVeBALChainBalance?.[gauge.chain]?.result

        const veBALChainTotalSupply = veBalTotalSupplyL2.results?.[gauge.chain]?.data as any
        const veBALTotalSupply =
          gauge.chain === GqlChain.Mainnet
            ? mainnetLockedInfo.totalSupply
            : veBALChainTotalSupply?.[gauge.chain]?.result || 0

        if (
          isUndefined(vebalBalance) ||
          isUndefined(veBALTotalSupply) ||
          isUndefined(totalSupply) ||
          isUndefined(userBalance)
        ) {
          return acc
        }

        const userBoost = calcUserBoost({
          userGaugeBalance: userBalance,
          gaugeTotalSupply: totalSupply,
          userVeBALBalance: vebalBalance,
          veBALTotalSupply,
        })

        acc[poolId] = userBoost

        return acc
      },
      {} as Record<string, string>
    )
  }, [gaugeDataByPoolMap, veBalTotalSupplyL2, userVeBALBalances, mainnetLockedInfo])

  return { calcedBoostsByPool }
}
