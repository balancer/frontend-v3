import { useQuery } from '@tanstack/react-query'
import { sleep } from '@/lib/shared/utils/sleep'

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

  const fetchOmniEscrowLocks = async (): Promise<OmniEscrowLockResponse> => {
    // Mocked data
    await sleep(500)
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
