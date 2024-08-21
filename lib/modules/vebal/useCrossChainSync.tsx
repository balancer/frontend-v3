import networkConfigs from '@/lib/config/networks';
import { useState, useEffect, useMemo, useCallback, useContext, createContext } from'react';
import { OmniEscrowLock, useOmniEscrowLocksQuery } from './useOmniEscrowLocksQuery';
import { useUserAccount } from '../web3/UserAccountProvider';
import { NetworkSyncState, useCrossChainNetwork } from './useCrossChainNetwork';
import { GqlChain } from '@/lib/shared/services/api/generated/graphql';

const veBalSyncSupportedNetworks: GqlChain[] = Object.keys(networkConfigs)
  .filter(key => networkConfigs[key as keyof typeof networkConfigs].supportsVeBalSync)
  .map(key => key) as GqlChain[];

const REFETCH_INTERVAL = 1000 * 30;
const REFETCH_GET_LAYER_ZERO_TX_LINKS_INTERVAL = 1000 * 5;

const CrossChainSyncContext = createContext(null);

export const useCrossChainSync = () => {
  return useContext(CrossChainSyncContext);
};

export const CrossChainSyncProvider = () => {
  const { userAddress } = useUserAccount()
  const { data: omniEscrowResponse, isLoading: isLoadingOmniEscrow, refetch: refetchOmniEscrow, isError: isOmniEscrowError } = useOmniEscrowLocksQuery(userAddress);

  const [tempSyncingNetworks, setTempSyncingNetworks] = useState(() =>JSON.parse(localStorage.getItem('tempSyncingNetworks') || '{}'));
  const [syncTxHashes, setSyncTxHashes] = useState(() =>JSON.parse(localStorage.getItem('syncTxHashes') || '{}'));
  const [syncLayerZeroTxLinks, setSyncLayerZeroTxLinks] = useState({});

  const allNetworksUnsynced = useMemo(() => omniEscrowResponse?.omniVotingEscrowLocks.length === 0, [omniEscrowResponse]);
  
  const omniEscrowLocksMap = useMemo(() => {
    if (allNetworksUnsynced || !omniEscrowResponse) return null;
    return omniEscrowResponse.omniVotingEscrowLocks.reduce<Record<string, OmniEscrowLock>>((acc, item) => {
      acc[item.dstChainId] = item;
      return acc;
    }, {});
  }, [allNetworksUnsynced, omniEscrowResponse]);

  const mainnetCrossChainNetwork = useCrossChainNetwork(GqlChain.Mainnet, omniEscrowLocksMap);

  const mainnetEscrowLocks = useMemo(() => mainnetCrossChainNetwork.votingEscrowLocks, [mainnetCrossChainNetwork]);

  const crossChainNetworks = {} as Record<GqlChain, ReturnType<typeof useCrossChainNetwork>>;
  veBalSyncSupportedNetworks.forEach(networkId => {
    crossChainNetworks[networkId] = useCrossChainNetwork(networkId, omniEscrowLocksMap);
  });

  const isLoading = useMemo(() => isLoadingOmniEscrow || mainnetCrossChainNetwork.isLoading, [isLoadingOmniEscrow, mainnetCrossChainNetwork]);

  const networksSyncState = useMemo(() => {
    return veBalSyncSupportedNetworks.reduce<Partial<Record<GqlChain, NetworkSyncState>>>((acc, network) => {
      acc[network] = crossChainNetworks[network]!.getNetworkSyncState(omniEscrowLocksMap?.[networkConfigs[network].layerZeroChainId || ''], mainnetEscrowLocks);
      return acc;
    }, {});
  }, [crossChainNetworks, mainnetEscrowLocks, omniEscrowLocksMap]);

  const networksBySyncState = useMemo(() => {
    const networksWithValidSyncState = Object.keys(networksSyncState) as GqlChain[];

    return {
      synced: networksWithValidSyncState.filter(network => networksSyncState[network] === NetworkSyncState.Synced),
      unsynced: networksWithValidSyncState.filter(network => networksSyncState[network] === NetworkSyncState.Unsynced),
      syncing: networksWithValidSyncState.filter(network => networksSyncState[network] === NetworkSyncState.Syncing || tempSyncingNetworks[userAddress]?.networks.includes(network)),
    };
  }, [networksSyncState, tempSyncingNetworks, userAddress]);

  const showingUnsyncedNetworks = useMemo(() => {
    return [...networksBySyncState.unsynced, ...networksBySyncState.syncing];
  }, [networksBySyncState]);

  const hasError = useMemo(() => isOmniEscrowError || veBalSyncSupportedNetworks.some(network => crossChainNetworks[network].isError), [isOmniEscrowError, crossChainNetworks]);

  const l2VeBalBalances = useMemo(() => {
    return veBalSyncSupportedNetworks.reduce<Partial<Record<GqlChain, string>>>((acc, network) => {
      acc[network] = crossChainNetworks[network].calculateVeBAlBalance();
      return acc;
    }, {});
  }, [crossChainNetworks]);

  const warningMessage = useMemo(() => {
    if (networksBySyncState.syncing.length > 0) {
      return {
        title: 'Syncing in Progress',
        text: 'Your cross-chain sync is currently in progress. Please wait.',
      };
    }
    return null;
  }, [networksBySyncState]);

  const infoMessage = useMemo(() => {
    if (!warningMessage && networksBySyncState.synced.length > 0) {
      return {
        title: 'Gauge Update Needed',
        text: 'You may need to update your gauge.',
      };
    }
    return null;
  }, [warningMessage, networksBySyncState]);

  // Fix errors below. Is is only partially rewritten file

  const sync = useCallback(async (network) => {
    const contractAddress = configService.network.addresses.omniVotingEscrow;
    if (!contractAddress) thrownewError('No contract address found');
    const signer = getSigner();
    const omniVotingEscrowContract = newOmniVotingEscrow(contractAddress);

    const layerZeroChainId = configs[network].layerZeroChainId;
    if (!layerZeroChainId) thrownewError('Must specify layer zero chain id');

    const tx = await omniVotingEscrowContract.estimateSendUserBalance(signer, layerZeroChainId);
    const { nativeFee } = tx;

    returnawait omniVotingEscrowContract.sendUserBalance({
      signer,
      userAddress: account,
      chainId: layerZeroChainId,
      nativeFee,
    });
  }, [account, getSigner]);

  const refetch = useCallback(async () => {
    awaitPromise.all([
      refetchOmniEscrow(),
      mainnetCrossChainNetwork.refetch(),
    ]);

    if (omniEscrowLocksMap) {
      const promises = networksBySyncState.syncing.map(networkId => crossChainNetworks[networkId].refetch());
      awaitPromise.all(promises);
    }
  }, [refetchOmniEscrow, mainnetCrossChainNetwork, omniEscrowLocksMap, networksBySyncState, crossChainNetworks]);

  useEffect(() => {
    let intervalId;
    if (networksBySyncState.syncing.length > 0) {
      intervalId = setInterval(() => {
        voidrefetch();
      }, REFETCH_INTERVAL);
    }
    return() =>clearInterval(intervalId);
  }, [networksBySyncState, refetch]);

  const clearTempSyncingNetworksFromSynced = useCallback(() => {
    if (!tempSyncingNetworks[account]) return;

    setTempSyncingNetworks((prev) => {
      const updatedNetworks = prev[account].networks.filter(network => !networksBySyncState.synced.includes(network));
      return { ...prev, [account]: { ...prev[account], networks: updatedNetworks } };
    });

    localStorage.setItem('tempSyncingNetworks', JSON.stringify(tempSyncingNetworks));
  }, [account, networksBySyncState, tempSyncingNetworks]);

  const getGaugeWorkingBalance = useCallback(async (gaugeAddress) => {
    if (!isPoolBoostsEnabled) return;
    const contractAddress = configService.network.addresses.gaugeWorkingBalanceHelper;
    if (!contractAddress) thrownewError('No contract address found');
    const signer = getSigner();
    const workingBalanceHelperContract = newGaugeWorkingBalanceHelper(contractAddress);
    return workingBalanceHelperContract.getWorkingBalanceToSupplyRatios({
      signer,
      userAddress: account,
      gauge: gaugeAddress,
    });
  }, [account, getSigner]);

  const shouldPokeGauge = useCallback(async (gaugeAddress) => {
    const balance = awaitgetGaugeWorkingBalance(gaugeAddress);
    return balance && balance[1]?.gt(balance[0]);
  }, [getGaugeWorkingBalance]);

  const getLayerZeroTxLink = useCallback(async (txHash) => {
    const { messages } = awaitgetMessagesBySrcTxHash(101, txHash);
    const message = messages[0];
    if (!message) {
      console.error('No message found in Layer Zero');
      return'';
    }
    return`https://layerzeroscan.com/tx/${message.srcTxHash}`;
  }, []);

  const getLayerZeroTxLinkOnInterval = useCallback((networks) => {
    let retryCount = 0;
    const intervalId = setInterval(async () => {
      for (const network of networks) {
        const hash = syncTxHashes[account]?.[network];
        if (hash) {
          const link = awaitgetLayerZeroTxLink(hash);
          setSyncLayerZeroTxLinks((prev) => ({ ...prev, [network]: link }));
        }
      }
      retryCount++;
      if (networks.every(network => syncLayerZeroTxLinks[network]) || retryCount > 10) {
        clearInterval(intervalId);
      }
    }, REFETCH_GET_LAYER_ZERO_TX_LINKS_INTERVAL);

    return() =>clearInterval(intervalId);
  }, [account, syncTxHashes, getLayerZeroTxLink, syncLayerZeroTxLinks]);

  useEffect(() => {
    const networks = Object.keys(syncTxHashes[account] || {});
    if (networks.length > 0) {
      getLayerZeroTxLinkOnInterval(networks);
    }
  }, [syncTxHashes, account, getLayerZeroTxLinkOnInterval]);

  useEffect(() => {
    if (networksBySyncState.synced.length > 0) {
      const hasSyncingMismatch = networksBySyncState.syncing.some(network => networksBySyncState.synced.includes(network));
      if (hasSyncingMismatch) {
        clearTempSyncingNetworksFromSynced();
      }
    }
  }, [networksBySyncState, clearTempSyncingNetworksFromSynced]);

  return {
    showingUnsyncedNetworks,
    hasError,
    omniEscrowLocksMap,
    networksSyncState,
    isLoading,
    networksBySyncState,
    l2VeBalBalances,
    sync,
    refetch,
    tempSyncingNetworks,
    setTempSyncingNetworks,
    warningMessage,
    infoMessage,
    getGaugeWorkingBalance,
    getLayerZeroTxLink,
    syncTxHashes,
    setSyncTxHashes,
    syncLayerZeroTxLinks,
    shouldPokeGauge,
  }
};
