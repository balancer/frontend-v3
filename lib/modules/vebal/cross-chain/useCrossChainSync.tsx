import networkConfigs from '@/lib/config/networks'
import { useState, useEffect, useMemo, useCallback, createContext, PropsWithChildren } from 'react'
import { OmniEscrowLock, useOmniEscrowLocksQuery } from './useOmniEscrowLocksQuery'
import { useUserAccount } from '../../web3/UserAccountProvider'
import { NetworkSyncState, useCrossChainNetworks } from './useCrossChainNetworks'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Address, Hex } from 'viem'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { getMessagesBySrcTxHash } from '@layerzerolabs/scan-client'
import { keyBy } from 'lodash'
import { useLocalStorage } from 'usehooks-ts'
import { LS_KEYS } from '@/lib/modules/local-storage/local-storage.constants'

const veBalSyncSupportedNetworks: GqlChain[] = Object.keys(networkConfigs)
  .filter(key => networkConfigs[key as keyof typeof networkConfigs].supportsVeBalSync)
  .map(key => key) as GqlChain[]

const REFETCH_INTERVAL = 1000 * 30
const REFETCH_GET_LAYER_ZERO_TX_LINKS_INTERVAL = 1000 * 5

export type CrossChainSyncResult = ReturnType<typeof _useCrossChainSync>
export const CrossChainSyncContext = createContext<CrossChainSyncResult | null>(null)

export interface TempSyncingNetworks {
  networks: GqlChain[]
  syncTimestamp?: number
}

export interface SyncTxHashes {
  [key: string]: Hex
}

const initialTempSyncingNetworks: Record<string, TempSyncingNetworks> = {}
const initialSyncTxHashes: Record<string, SyncTxHashes> = {}

export const _useCrossChainSync = () => {
  const { userAddress } = useUserAccount()

  const {
    data: omniEscrowResponse,
    isLoading: isLoadingOmniEscrow,
    refetch: refetchOmniEscrow,
    isError: isOmniEscrowError,
  } = useOmniEscrowLocksQuery(userAddress)

  const [tempSyncingNetworks, setTempSyncingNetworks] = useLocalStorage(
    LS_KEYS.CrossChainSync.TempSyncingNetworks,
    initialTempSyncingNetworks
  )
  const [syncTxHashes, _setSyncTxHashes] = useLocalStorage(
    LS_KEYS.CrossChainSync.SyncTxHashes,
    initialSyncTxHashes
  )
  const [syncLayerZeroTxLinks, setSyncLayerZeroTxLinks] = useState<Record<string, string>>({})

  const allNetworksUnsynced = useMemo(
    () => omniEscrowResponse?.omniVotingEscrowLocks.length === 0,
    [omniEscrowResponse]
  )

  const omniEscrowLocksMap = useMemo(() => {
    if (allNetworksUnsynced || !omniEscrowResponse) return null
    return omniEscrowResponse.omniVotingEscrowLocks.reduce<Record<string, OmniEscrowLock>>(
      (acc, item) => {
        acc[item.dstChainId] = item
        return acc
      },
      {}
    )
  }, [allNetworksUnsynced, omniEscrowResponse])

  const [mainnetCrossChainNetwork] = useCrossChainNetworks([GqlChain.Mainnet], omniEscrowLocksMap)

  const mainnetEscrowLocks = useMemo(
    () => mainnetCrossChainNetwork.votingEscrowLocks,
    [mainnetCrossChainNetwork]
  )

  const crossChainNetworksResponses = useCrossChainNetworks(
    veBalSyncSupportedNetworks,
    omniEscrowLocksMap
  )
  const crossChainNetworks = keyBy(crossChainNetworksResponses, 'chainId')

  const isLoading = useMemo(
    () => isLoadingOmniEscrow || mainnetCrossChainNetwork.isLoading,
    [isLoadingOmniEscrow, mainnetCrossChainNetwork]
  )

  const networksSyncState = useMemo(() => {
    return veBalSyncSupportedNetworks.reduce<Partial<Record<GqlChain, NetworkSyncState>>>(
      (acc, network) => {
        acc[network] = crossChainNetworks[network]!.getNetworkSyncState(
          omniEscrowLocksMap?.[networkConfigs[network].layerZeroChainId || ''],
          mainnetEscrowLocks
        )
        return acc
      },
      {}
    )
  }, [crossChainNetworks, mainnetEscrowLocks, omniEscrowLocksMap])

  const networksBySyncState = useMemo(() => {
    const networksWithValidSyncState = Object.keys(networksSyncState) as GqlChain[]

    return {
      synced: networksWithValidSyncState.filter(
        network => networksSyncState[network] === NetworkSyncState.Synced
      ),
      unsynced: networksWithValidSyncState.filter(
        network => networksSyncState[network] === NetworkSyncState.Unsynced
      ),
      syncing: networksWithValidSyncState.filter(
        network =>
          networksSyncState[network] === NetworkSyncState.Syncing ||
          tempSyncingNetworks[userAddress]?.networks.includes(network)
      ),
    }
  }, [networksSyncState, tempSyncingNetworks, userAddress])

  const showingUnsyncedNetworks = useMemo(() => {
    return [...networksBySyncState.unsynced, ...networksBySyncState.syncing]
  }, [networksBySyncState])

  const hasError = useMemo(
    () =>
      isOmniEscrowError ||
      veBalSyncSupportedNetworks.some(network => crossChainNetworks[network].isError),
    [isOmniEscrowError, crossChainNetworks]
  )

  const l2VeBalBalances = useMemo(() => {
    return veBalSyncSupportedNetworks.reduce<Partial<Record<GqlChain, string>>>((acc, network) => {
      acc[network] = crossChainNetworks[network].calculateVeBAlBalance()
      return acc
    }, {})
  }, [crossChainNetworks])

  const warningMessage = useMemo(() => {
    if (networksBySyncState.syncing.length > 0) {
      return {
        title: 'Syncing in Progress',
        text: 'Your cross-chain sync is currently in progress. Please wait.',
      }
    }
    return null
  }, [networksBySyncState])

  const infoMessage = useMemo(() => {
    if (!warningMessage && networksBySyncState.synced.length > 0) {
      return {
        title: 'Gauge Update Needed',
        text: 'You may need to update your gauge.',
      }
    }
    return null
  }, [warningMessage, networksBySyncState])

  const refetch = useCallback(async () => {
    await Promise.all([refetchOmniEscrow(), mainnetCrossChainNetwork.refetch()])

    if (omniEscrowLocksMap) {
      const promises = networksBySyncState.syncing.map(networkId =>
        crossChainNetworks[networkId].refetch()
      )
      await Promise.all(promises)
    }
  }, [
    refetchOmniEscrow,
    mainnetCrossChainNetwork,
    omniEscrowLocksMap,
    networksBySyncState,
    crossChainNetworks,
  ])

  useEffect(() => {
    let intervalId: NodeJS.Timer
    if (networksBySyncState.syncing.length > 0) {
      intervalId = setInterval(() => {
        void refetch()
      }, REFETCH_INTERVAL)
    }
    return () => clearInterval(intervalId)
  }, [networksBySyncState, refetch])

  const setSyncTxHashes = useCallback(
    (network: GqlChain, txHash: Hex) => {
      _setSyncTxHashes(prev => ({
        ...prev,
        [userAddress]: {
          ...prev[userAddress],
          [network]: txHash,
        },
      }))
    },
    [userAddress, _setSyncTxHashes]
  )

  const clearTempSyncingNetworksFromSynced = useCallback(() => {
    if (!tempSyncingNetworks[userAddress]) return

    setTempSyncingNetworks(prev => {
      const updatedNetworks = prev[userAddress].networks.filter(
        network => !networksBySyncState.synced.includes(network)
      )
      return { ...prev, [userAddress]: { ...prev[userAddress], networks: updatedNetworks } }
    })
  }, [userAddress, networksBySyncState, tempSyncingNetworks])

  const getLayerZeroTxLink = useCallback(async (txHash: Address) => {
    const { messages } = await getMessagesBySrcTxHash(101, txHash)
    const message = messages[0]
    if (!message) {
      console.error('No message found in Layer Zero')
      return ''
    }
    return `https://layerzeroscan.com/tx/${message.srcTxHash}`
  }, [])

  const getLayerZeroTxLinkOnInterval = useCallback(
    (networks: string[]) => {
      let retryCount = 0
      const intervalId = setInterval(async () => {
        for (const network of networks) {
          const hash = syncTxHashes[userAddress]?.[network]
          if (hash) {
            const link = await getLayerZeroTxLink(hash)
            setSyncLayerZeroTxLinks(prev => ({ ...prev, [network]: link }))
          }
        }
        retryCount++
        if (networks.every(network => syncLayerZeroTxLinks[network]) || retryCount > 10) {
          clearInterval(intervalId)
        }
      }, REFETCH_GET_LAYER_ZERO_TX_LINKS_INTERVAL)

      return intervalId
    },
    [userAddress, syncTxHashes, getLayerZeroTxLink, syncLayerZeroTxLinks]
  )

  useEffect(() => {
    const networks = Object.keys(syncTxHashes[userAddress] || {})
    let intervalId: NodeJS.Timer
    if (networks.length > 0) {
      intervalId = getLayerZeroTxLinkOnInterval(networks)
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [syncTxHashes, userAddress, getLayerZeroTxLinkOnInterval])

  useEffect(() => {
    if (networksBySyncState.synced.length > 0) {
      const hasSyncingMismatch = networksBySyncState.syncing.some(network =>
        networksBySyncState.synced.includes(network)
      )
      if (hasSyncingMismatch) {
        clearTempSyncingNetworksFromSynced()
      }
    }
  }, [networksBySyncState, clearTempSyncingNetworksFromSynced])

  return {
    showingUnsyncedNetworks,
    hasError,
    omniEscrowLocksMap,
    networksSyncState,
    isLoading,
    networksBySyncState,
    l2VeBalBalances,
    refetch,
    tempSyncingNetworks,
    setTempSyncingNetworks,
    warningMessage,
    infoMessage,
    getLayerZeroTxLink,
    syncTxHashes,
    setSyncTxHashes,
    syncLayerZeroTxLinks,
  }
}

export function CrossChainSyncProvider({ children }: PropsWithChildren) {
  const hook = _useCrossChainSync()
  return <CrossChainSyncContext.Provider value={hook}>{children}</CrossChainSyncContext.Provider>
}

export const useCrossChainSync = (): CrossChainSyncResult =>
  useMandatoryContext(CrossChainSyncContext, 'CrossChainSyncContext')
