import { useMemo } from 'react'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import networkConfigs from '@/lib/config/networks'
import { OmniEscrowLock } from './useOmniEscrowLocksQuery'
import { useVotingEscrowLocksQueries, VotingEscrowLock } from './useVotingEscrowLocksQueries'
import { bn } from '@/lib/shared/utils/numbers'
import { useUserAccount } from '../../web3/UserAccountProvider'

export enum NetworkSyncState {
  Unsynced = 'Unsynced',
  Syncing = 'Syncing',
  Synced = 'Synced',
  Unknown = 'Unknown',
}

function allEqual(array: any[]) {
  return array.every(value => value === array[0])
}

export function useCrossChainNetworks(
  chainIds: GqlChain[],
  omniEscrowMap: Record<number, OmniEscrowLock> | null
) {
  const { userAddress } = useUserAccount()

  const remoteUsers = useMemo(() => {
    return chainIds.map(chainId => {
      if (chainId === GqlChain.Mainnet) {
        return userAddress
      }
      const layerZeroChainId = networkConfigs[chainId]?.layerZeroChainId
      return layerZeroChainId
        ? omniEscrowMap?.[layerZeroChainId]?.remoteUser || userAddress
        : userAddress
    })
  }, [chainIds, userAddress, omniEscrowMap])

  const votingEscrowResponses = useVotingEscrowLocksQueries(remoteUsers)

  const result = useMemo(() => {
    return votingEscrowResponses.map(
      ({ data: votingEscrowResponse, refetch, isError, isLoading: isInitialLoading }, index) => {
        const chainId = chainIds[index]

        if (!chainId) {
          throw new Error(`useCrossChainNetworks - ${chainId} not found in ${chainIds}`)
        }

        const votingEscrowLocks = votingEscrowResponse?.votingEscrowLocks[0]

        const getNetworkSyncState = (
          omniEscrowLock?: OmniEscrowLock | null,
          mainnetEscrowLock?: VotingEscrowLock
        ) => {
          if (!omniEscrowLock || !mainnetEscrowLock || !votingEscrowLocks) {
            return NetworkSyncState.Unsynced
          }

          const biasOmni = omniEscrowLock.bias
          const slopeOmni = omniEscrowLock.slope

          const biasMainnet = mainnetEscrowLock.bias
          const slopeMainnet = mainnetEscrowLock.slope

          const biasNetwork = votingEscrowLocks.bias
          const slopeNetwork = votingEscrowLocks.slope

          if (!slopeOmni || !slopeMainnet || !slopeNetwork) {
            return NetworkSyncState.Unsynced
          }

          const isSynced =
            allEqual([biasOmni, biasMainnet, biasNetwork]) &&
            allEqual([slopeOmni, slopeMainnet, slopeNetwork])

          const isSyncing =
            allEqual([biasOmni, biasMainnet]) &&
            allEqual([slopeOmni, slopeMainnet]) &&
            slopeOmni !== slopeNetwork &&
            biasOmni !== biasNetwork

          if (isSynced) {
            return NetworkSyncState.Synced
          }

          if (isSyncing) {
            return NetworkSyncState.Syncing
          }

          return NetworkSyncState.Unsynced
        }

        const calculateVeBAlBalance = () => {
          const bias = votingEscrowLocks?.bias
          const slope = votingEscrowLocks?.slope
          const timestamp = votingEscrowLocks?.timestamp

          if (!bias || !slope || !timestamp) return bn(0).toFixed(4).toString()

          const x = bn(slope).multipliedBy(Math.floor(Date.now() / 1000) - timestamp)

          if (x.isLessThan(0)) return bn(bias).toFixed(4).toString()

          const balance = bn(bias).minus(x)
          if (balance.isLessThan(0)) return bn(0).toFixed(4).toString()

          return balance.toFixed(4).toString()
        }

        return {
          chainId,
          getNetworkSyncState,
          votingEscrowLocks,
          refetch,
          calculateVeBAlBalance,
          isLoading: isInitialLoading,
          isError,
        }
      }
    )
  }, [votingEscrowResponses, chainIds])

  return result
}
