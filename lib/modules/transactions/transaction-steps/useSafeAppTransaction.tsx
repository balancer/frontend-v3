import { useEffect, useState } from 'react'
import { useUserAccount } from '../../web3/UserAccountProvider'
import { useWatchContractEvent } from 'wagmi'
import { Hex, parseAbi, parseAbiItem } from 'viem'
import { useQuery } from '@tanstack/react-query'
import { getViemClient } from '@/lib/shared/services/viem/viem.client'
import { getGqlChain } from '@/lib/config/app.config'

const safeAbi = parseAbi(['event ExecutionSuccess(bytes32 txHash, uint256 payment)'])

type Props = {
  hash: Hex | undefined
  chainId: number
  blockNumber?: bigint
}

// This is not being used. Will be removed in the next commit
export function useSafeAppTransaction({ hash, chainId }: Props) {
  const { userAddress } = useUserAccount()
  const [safeTxHash, setSafeTxHash] = useState<`0x${string}` | undefined>()

  useWatchContractEvent({
    enabled: !!hash,
    abi: safeAbi,
    chainId,
    address: userAddress,
    eventName: 'ExecutionSuccess',
    poll: false,
    onLogs(logs) {
      logs.forEach(log => {
        console.log('DETECTED LOG: ', { logTxHash: log.args.txHash, hash })
        if (log.args.txHash === hash) {
          if (!log.transactionHash) {
            throw new Error('Safe App Transaction hash not found')
          }

          setSafeTxHash(log.transactionHash)
        }
      })
    },
  })

  return { safeTxHash }
}

export function useSafeAppLogs({ hash, chainId, blockNumber }: Props) {
  const [safeTxHash, setSafeTxHash] = useState<Hex | undefined>()
  const { userAddress } = useUserAccount()
  const viemClient = getViemClient(getGqlChain(chainId))

  const safeLogs = useQuery({
    queryKey: ['safeLogs', userAddress, hash],
    queryFn: () =>
      viemClient.getLogs({
        event: parseAbiItem(['event ExecutionSuccess(bytes32 txHash, uint256 payment)']),
        address: userAddress,
        fromBlock: blockNumber,
      }),
    select: data => data.find(log => log.args.txHash === hash),
    refetchInterval: safeTxHash ? 0 : 2000, // Refetch every 2 seconds until the safeTxHash is found
    enabled: !!hash && !!userAddress,
  })

  useEffect(() => {
    const txHash = safeLogs.data?.transactionHash
    if (txHash) {
      setSafeTxHash(txHash)
    }
  }, [safeLogs.data?.transactionHash, safeTxHash])

  return { safeTxHash }
}
