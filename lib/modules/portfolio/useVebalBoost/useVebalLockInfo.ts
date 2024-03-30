import { useMemo } from 'react'
import { useUserAccount } from '../../web3/useUserAccount'
import { useMulticall } from '../../web3/contracts/useMulticall'
import networkConfig from '@/lib/config/networks/mainnet'
import { Hex, formatUnits } from 'viem'
import { toJsTimestamp } from '@/lib/shared/hooks/useTime'
import { bn } from '@/lib/shared/utils/numbers'
import { AbiMap } from '../../web3/contracts/AbiMap'

export function useVebalLockInfo() {
  const { userAddress, isConnected } = useUserAccount()

  const lockInfoRequestsData = [
    {
      path: 'locked',
      fn: 'locked',
      args: [userAddress],
    },
    {
      path: 'epoch',
      fn: 'epoch',
    },
    {
      path: 'totalSupply',
      fn: 'totalSupply',
    },
  ]

  // get lock info
  const lockInfoRequests = lockInfoRequestsData.map(v => {
    return {
      chain: networkConfig.chain,
      id: `${v.path}.${v.fn}`,
      abi: AbiMap['balancer.veBAL'] as any,
      address: networkConfig.contracts.veBAL as Hex,
      functionName: v.fn,
      args: v.args,
    }
  })

  const { results, refetchAll, isLoading } = useMulticall(lockInfoRequests)

  const mainnetLockedInfo = useMemo(() => {
    const mainnetResults = results[networkConfig.chain]

    if (mainnetResults.status === 'error') {
      // handle error
      return {}
    }

    if (mainnetResults.status === 'loading') {
      // handle loading
      return {}
    }

    const data = mainnetResults.data as any
    const lockedData = data.locked.locked
    const totalSupply = data.totalSupply.totalSupply
    const epoch = data.epoch.epoch

    const { amount: lockedAmount, end: lockedEndDate } = lockedData.result

    const hasExistingLock = bn(lockedAmount).gt(0)
    const lockedEndDateNormalised = toJsTimestamp(Number(lockedEndDate))
    const isExpired = hasExistingLock && Date.now() > lockedEndDateNormalised

    return {
      lockedEndDate: lockedEndDateNormalised,
      lockedAmount: formatUnits(lockedAmount, 18),
      totalSupply: formatUnits(totalSupply.result, 18),
      epoch: String(epoch.result),
      hasExistingLock,
      isExpired,
    }
  }, [results])

  return { results, mainnetLockedInfo, isLoading, refetchAll }
}
