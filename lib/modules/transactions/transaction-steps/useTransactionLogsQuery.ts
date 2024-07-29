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
import { useMemo } from 'react'
import { emptyAddress } from '../../web3/contracts/wagmi-helpers'
import { HumanAmount } from '@balancer/sdk'

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

  const nativeAssetSent = query.data.value || 0n

  const sentErc20Tokens: HumanTokenAmountWithAddress[] = query.data.outgoing.map(log => {
    const tokenDecimals = getToken(log.address, chain)?.decimals
    return _toHumanAmountWithAddress(log.address, log.args.value, tokenDecimals)
  })

  const sentTokens = bn(nativeAssetSent).gt(0)
    ? [
        ...sentErc20Tokens,
        _toHumanAmountWithAddress(getNativeAssetAddress(chain), nativeAssetSent, 18),
      ]
    : sentErc20Tokens

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
  const nativeAssetReceived = query.data.incomingWithdrawals[0]?.args?.wad || 0n

  const receivedErc20Tokens: HumanTokenAmountWithAddress[] = query.data.incoming.map(log => {
    const tokenDecimals = getToken(log.address, chain)?.decimals
    return _toHumanAmountWithAddress(log.address, log.args.value, tokenDecimals)
  })

  const receivedTokens = bn(nativeAssetReceived).gt(0)
    ? [
        ...receivedErc20Tokens,
        _toHumanAmountWithAddress(getNativeAssetAddress(chain), nativeAssetReceived, 18),
      ]
    : receivedErc20Tokens

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

  /**
   * GET SENT AMOUNT
   */
  const nativeAssetSent = query.data.value || 0n

  const outgoingData = query.data.outgoing[0]
  const sentTokenValue = outgoingData?.args?.value || 0n
  const sentTokenAddress = outgoingData?.address
  const sentToken = getToken(sentTokenAddress, chain)

  const sentHumanAmountWithAddress: HumanTokenAmountWithAddress = bn(sentTokenValue).gt(0)
    ? _toHumanAmountWithAddress(sentTokenAddress, outgoingData?.args?.value, sentToken?.decimals)
    : bn(nativeAssetSent).gt(0)
    ? _toHumanAmountWithAddress(getNativeAssetAddress(chain), nativeAssetSent, 18)
    : { tokenAddress: emptyAddress, humanAmount: '0' as HumanAmount }

  /**
   * GET RECEIVED AMOUNT
   */
  const nativeAssetReceived = query.data.incomingWithdrawals[0]?.args?.wad || 0n

  const incomingData = query.data.incoming[0]
  const receivedTokenValue = incomingData?.args?.value || 0n
  const receivedTokenAddress = incomingData?.address
  const receivedToken = getToken(receivedTokenAddress, chain)

  const receivedHumanAmountWithAddress = bn(receivedTokenValue).gt(0)
    ? _toHumanAmountWithAddress(receivedTokenAddress, receivedTokenValue, receivedToken?.decimals)
    : bn(nativeAssetReceived).gt(0)
    ? _toHumanAmountWithAddress(getNativeAssetAddress(chain), nativeAssetReceived, 18)
    : { tokenAddress: emptyAddress, humanAmount: '0' as HumanAmount }

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

  const blockHash = receipt.data?.blockHash

  const outgoingTransfersQuery = useQuery({
    queryKey: ['tx.logs.outgoing', userAddress, blockHash],
    queryFn: () =>
      viemClient.getLogs({
        blockHash,
        event: parseAbiItem(
          'event Transfer(address indexed from, address indexed to, uint256 value)'
        ),
        args: { from: userAddress },
      }),
    enabled: !!blockHash,
  })

  const incomingTransfersQuery = useQuery({
    queryKey: ['tx.logs.incoming.transfers', userAddress, blockHash],
    queryFn: () =>
      viemClient.getLogs({
        blockHash,
        event: parseAbiItem(
          'event Transfer(address indexed from, address indexed to, uint256 value)'
        ),
        args: { to: userAddress },
      }),
    enabled: !!blockHash,
  })

  // Catches when the wNativeAsset is withdrawn from the vault, assumption is
  // that his means the user is getting the same value in the native asset.
  // TODO V3 - This works for v2 vault but may not work for v3
  const incomingWithdrawalsQuery = useQuery({
    queryKey: ['tx.logs.incoming.withdrawals', userAddress, receipt.data?.blockHash],
    queryFn: () =>
      viemClient.getLogs({
        address: networkConfig.tokens.addresses.wNativeAsset,
        blockHash: receipt?.data?.blockHash,
        event: parseAbiItem('event Withdrawal(address indexed src, uint256 wad)'),
        args: { src: networkConfig.contracts.balancer.vaultV2 },
      }),
    enabled: !!blockHash,
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

  const incomingWithdrawalsData = useMemo(
    () =>
      incomingWithdrawalsQuery.data?.filter(log => isSameAddress(log.transactionHash, txHash)) ||
      [],
    [incomingWithdrawalsQuery.data, txHash]
  )

  return {
    error:
      receipt.error ||
      outgoingTransfersQuery.error ||
      incomingTransfersQuery.error ||
      incomingWithdrawalsQuery.error,
    isLoading:
      // We cannot guarantee that the transaction is in logs until blockHash is available
      !blockHash ||
      receipt.isLoading ||
      outgoingTransfersQuery.isLoading ||
      incomingTransfersQuery.isLoading ||
      incomingWithdrawalsQuery.isLoading,
    data: {
      value: receipt?.data?.value,
      outgoing: outgoingTransfersData,
      incoming: incomingTransfersData,
      incomingWithdrawals: incomingWithdrawalsData,
    },
  }
}
