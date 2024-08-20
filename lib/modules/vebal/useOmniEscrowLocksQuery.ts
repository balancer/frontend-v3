import { useQuery } from "@tanstack/react-query"

export interface OmniEscrowLock {
  id: string
  localUser: {
    id: string
  }
  remoteUser: string
  bias: string
  slope: string
  dstChainId: string
}

export interface OmniEscrowLockResponse {
  omniVotingEscrowLocks: OmniEscrowLock[]
}

export function useOmniEscrowLocksQuery(address: string) {
  const queryKey = ['OmniEscrowLocks', address]

  const fetchOmniEscrowLocks = async () => {
    // Mocked data
    return {
      omniVotingEscrowLocks: [],
    }
  }

  const isEnabled = !!address

  return useQuery({
    queryKey,
    queryFn: fetchOmniEscrowLocks,
    enabled: isEnabled,
    refetchOnWindowFocus: false,
  })
}
