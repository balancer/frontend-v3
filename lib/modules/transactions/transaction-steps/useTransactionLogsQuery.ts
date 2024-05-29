import { BPT_DECIMALS } from '@/lib/modules/pool/pool.constants'
import { usePool } from '@/lib/modules/pool/PoolProvider'
import { useTokens } from '@/lib/modules/tokens/TokensProvider'
import { getViemClient } from '@/lib/shared/services/viem/viem.client'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { useQuery } from '@tanstack/react-query'
import { formatUnits, parseAbiItem, Address } from 'viem'
import { useTransaction } from 'wagmi'
import { HumanTokenAmountWithAddress } from '../../tokens/token.types'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { getChainId, getNativeAssetAddress, getNetworkConfig } from '@/lib/config/app.config'
import { bn } from '@/lib/shared/utils/numbers'
import { useEffect, useMemo } from 'react'

const userNotConnected = 'User is not connected'

export type ReceiptProps = { txHash: Address; userAddress: Address }
export function useAddLiquidityReceipt({ txHash, userAddress }: ReceiptProps) {
  const { chain } = usePool()
  const query = useTransactionLogsQuery({ txHash, userAddress, chain })
  const { getToken } = useTokens()

  if (!userAddress) {
    return {
      isLoading: true,
      error: '',
      sentTokens: [],
      receivedBptUnits: '',
    }
  }

  const sentTokens: HumanTokenAmountWithAddress[] = query.data.outgoing.map(log => {
    const tokenDecimals = getToken(log.address, chain)?.decimals
    return _toHumanAmountWithAddress(log.address, log.args.value, tokenDecimals)
  })

  const receivedBptAmount = query.data.incoming?.[0]?.args?.value
  const receivedBptUnits = formatUnits(receivedBptAmount || 0n, BPT_DECIMALS)

  return {
    isLoading: query.isLoading,
    error: query.error,
    sentTokens,
    receivedBptUnits,
  }
}

export function useRemoveLiquidityReceipt({ txHash, userAddress }: ReceiptProps) {
  const { chain } = usePool()
  const query = useTransactionLogsQuery({ txHash, userAddress, chain })
  const { getToken } = useTokens()

  if (!userAddress) {
    return {
      isLoading: false,
      error: userNotConnected,
      receivedTokens: [],
      sentBptUnits: '',
    }
  }
  const receivedTokens: HumanTokenAmountWithAddress[] = query.data.incoming.map(log => {
    const tokenDecimals = getToken(log.address, chain)?.decimals
    return _toHumanAmountWithAddress(log.address, log.args.value, tokenDecimals)
  })

  const sentBptAmount = query.data.outgoing?.[0]?.args?.value
  const sentBptUnits = formatUnits(sentBptAmount || 0n, BPT_DECIMALS)

  return {
    isLoading: query.isLoading,
    error: query.error,
    receivedTokens,
    sentBptUnits,
  }
}

export function useSwapReceipt({ txHash, userAddress, chain }: ReceiptProps & { chain: GqlChain }) {
  const query = useTransactionLogsQuery({ txHash, userAddress, chain })
  const { getToken } = useTokens()

  const nativeAssetSent = query.data.value || 0n
  const outgoingData = query.data.outgoing[0]
  const sentTokenValue = outgoingData?.args?.value || 0n
  const sentTokenAddress = outgoingData?.address
  const sentToken = getToken(sentTokenAddress, chain)
  const sentHumanAmountWithAddress = bn(sentTokenValue).gt(0)
    ? _toHumanAmountWithAddress(sentTokenAddress, outgoingData?.args?.value, sentToken?.decimals)
    : bn(nativeAssetSent).gt(0)
    ? _toHumanAmountWithAddress(getNativeAssetAddress(chain), nativeAssetSent, 18)
    : { tokenAddress: '', humanAmount: '' }

  const incomingData = query.data.incoming[0]
  const receivedTokenValue = incomingData?.args?.value || 0n
  const receivedTokenAddress = incomingData?.address
  const receivedToken = getToken(receivedTokenAddress, chain)
  const receivedHumanAmountWithAddress = _toHumanAmountWithAddress(
    receivedTokenAddress,
    incomingData?.args?.value,
    receivedToken?.decimals
  )

  if (!userAddress) {
    return {
      isLoading: false,
      error: userNotConnected,
      sentToken: null,
      receivedToken: null,
    }
  }
  return {
    isLoading: query.isLoading,
    error: undefined,
    sentToken: sentHumanAmountWithAddress,
    receivedToken: receivedHumanAmountWithAddress,
  }
}

/*
  rawValue and tokenDecimals should always be valid so we use default values to avoid complex error handling
*/
function _toHumanAmountWithAddress(tokenAddress: Address, rawValue = 0n, tokenDecimals = 18) {
  const humanAmount = formatUnits(rawValue, tokenDecimals)
  return { tokenAddress: tokenAddress, humanAmount: humanAmount } as HumanTokenAmountWithAddress
}

export function useTransactionLogsQuery({
  txHash,
  userAddress,
  chain,
}: ReceiptProps & { chain: GqlChain }) {
  const chainId = getChainId(chain)
  const networkConfig = getNetworkConfig(chain)
  const viemClient = getViemClient(chain)
  const receipt = useTransaction({ hash: txHash, chainId })

  const outgoingTransfersQuery = useQuery({
    queryKey: ['tx.logs.outgoing', userAddress, receipt.data?.blockHash],
    queryFn: () =>
      viemClient.getLogs({
        blockHash: receipt?.data?.blockHash,
        event: parseAbiItem(
          'event Transfer(address indexed from, address indexed to, uint256 value)'
        ),
        args: { from: userAddress },
      }),
  })

  const incomingTransfersQuery = useQuery({
    queryKey: ['tx.logs.incoming.transfers', userAddress, receipt.data?.blockHash],
    queryFn: () =>
      viemClient.getLogs({
        blockHash: receipt?.data?.blockHash,
        event: parseAbiItem(
          'event Transfer(address indexed from, address indexed to, uint256 value)'
        ),
        args: { to: userAddress },
      }),
  })

  // Catches when the native asset is received from the vault.
  const incomingWithdawalsQuery = useQuery({
    queryKey: ['tx.logs.incoming.withdrawals', userAddress, receipt.data?.blockHash],
    queryFn: () =>
      viemClient.getLogs({
        blockHash: receipt?.data?.blockHash,
        address: networkConfig.contracts.balancer.vaultV2,
      }),
  })

  const outgoingTransfersData = useMemo(
    () =>
      outgoingTransfersQuery.data?.filter(log => isSameAddress(log.transactionHash, txHash)) || [],
    [outgoingTransfersQuery.data, txHash]
  )

  const incomingTransfersData = useMemo(
    () =>
      incomingTransfersQuery.data?.filter(log => isSameAddress(log.transactionHash, txHash)) || [],
    [incomingTransfersQuery.data, txHash]
  )

  const incomingWithdawalsData = useMemo(
    () =>
      incomingWithdawalsQuery.data?.filter(log => isSameAddress(log.transactionHash, txHash)) || [],
    [incomingWithdawalsQuery.data, txHash]
  )

  useEffect(() => {
    console.log('incomingWithdawalsData', incomingWithdawalsData, receipt)
  }, [incomingWithdawalsData])

  return {
    error:
      receipt.error ||
      outgoingTransfersQuery.error ||
      incomingTransfersQuery.error ||
      incomingWithdawalsQuery.error,
    isLoading:
      receipt.isLoading ||
      outgoingTransfersQuery.isLoading ||
      incomingTransfersQuery.isLoading ||
      incomingWithdawalsQuery.isLoading,
    data: {
      value: receipt?.data?.value,
      outgoing: outgoingTransfersData,
      incoming: incomingTransfersData,
      incomingWithdawals: incomingWithdawalsData,
    },
  }
}
