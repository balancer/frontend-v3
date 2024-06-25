import { SupportedChainId } from '@/lib/config/config.types'
import { WalletCapabilities } from 'viem'
import { useCapabilities } from 'wagmi/experimental'

// Wagmi's useCapabilities always returns a hard-coded value to we need isTest to test this feature until they fix this
const isTest = process.env.NEXT_PUBLIC_APP_ENV === 'test'

/*
  More info:
  EIP-5792
  https://wagmi.sh/react/api/hooks/useSendCalls
  https://wagmi.sh/react/api/hooks/useWriteContracts#usewritecontracts
 */
export function useBatchTransactions(chainId: SupportedChainId) {
  const { data, isLoading } = useCapabilities()

  const chainCapabilities: WalletCapabilities | undefined = data?.[chainId]

  return {
    isLoadingBatchTransactions: isLoading,
    supportsBatchTransactions: isTest
      ? !isLoading
      : chainCapabilities?.atomicBatch?.supported ?? false,
  }
}
