import { BPT_DECIMALS } from '@/lib/modules/pool/pool.constants'
import { usePool } from '@/lib/modules/pool/usePool'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { getViemClient } from '@/lib/shared/services/viem/viem.client'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { useQuery } from '@tanstack/react-query'
import { formatUnits, parseAbiItem, Address } from 'viem'
import { useTransaction } from 'wagmi'
import { HumanTokenAmountWithAddress } from '../../tokens/token.types'

export type ReceiptProps = { txHash: Address; userAddress: Address }
export function useAddLiquidityReceipt({ txHash, userAddress }: ReceiptProps) {
  const query = useTransactionLogsQuery({ txHash, userAddress })
  const { chain } = usePool()
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
    return _toHumanAmountIn(log.address, log.args.value, tokenDecimals)
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
  const query = useTransactionLogsQuery({ txHash, userAddress })
  const { chain } = usePool()
  const { getToken } = useTokens()

  if (!userAddress) {
    return {
      isLoading: false,
      error: 'User is not connected',
      receivedTokens: [],
      sentBptUnits: '',
    }
  }
  const receivedTokens: HumanTokenAmountWithAddress[] = query.data.incoming.map(log => {
    const tokenDecimals = getToken(log.address, chain)?.decimals
    return _toHumanAmountIn(log.address, log.args.value, tokenDecimals)
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

/*
  rawValue and tokenDecimals should always be valid so we use default values to avoid complex error handling
*/
function _toHumanAmountIn(tokenAddress: Address, rawValue = 0n, tokenDecimals = 18) {
  const humanAmount = formatUnits(rawValue, tokenDecimals)
  return { tokenAddress: tokenAddress, humanAmount: humanAmount } as HumanTokenAmountWithAddress
}

export function useTransactionLogsQuery({ txHash, userAddress }: ReceiptProps) {
  const { pool, chainId } = usePool()
  const viemClient = getViemClient(pool.chain)
  const receipt = useTransaction({ hash: txHash, chainId })

  const outgoingLogsQuery = useQuery({
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

  const incomingLogsQuery = useQuery({
    queryKey: ['tx.logs.incoming', userAddress, receipt.data?.blockHash],
    queryFn: () =>
      viemClient.getLogs({
        blockHash: receipt?.data?.blockHash,
        event: parseAbiItem(
          'event Transfer(address indexed from, address indexed to, uint256 value)'
        ),
        args: { to: userAddress },
      }),
  })

  const outgoingData =
    outgoingLogsQuery.data?.filter(log => isSameAddress(log.transactionHash, txHash)) || []

  const incomingData =
    incomingLogsQuery.data?.filter(log => isSameAddress(log.transactionHash, txHash)) || []

  return {
    error: receipt.error || outgoingLogsQuery.error || incomingLogsQuery.error,
    isLoading: receipt.isLoading || outgoingLogsQuery.isLoading || incomingLogsQuery.isLoading,
    data: { outgoing: outgoingData, incoming: incomingData },
  }
}
