import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export interface VotingEscrowLock {
  id: string
  slope: string
  bias: string
  timestamp: number
}

export interface VotingEscrowLockResponse {
  votingEscrowLocks: VotingEscrowLock[]
}

export function useVotingEscrowLocksQuery(address: string | undefined) {
  const votingEscrowLocksQueryEnabled = useMemo(() => {
    return !!address
  }, [address])

  const fetchVotingEscrowLocks = async (): Promise<VotingEscrowLockResponse> => {
    // Mocked data
    return {
      votingEscrowLocks: [],
    }
  }

  return useQuery({
    queryKey: ['VotingEscrowLocksByNetworkId', address],
    queryFn: fetchVotingEscrowLocks,
    enabled: votingEscrowLocksQueryEnabled,
    refetchOnWindowFocus: false,
  })
}
