import { useNetwork } from 'wagmi'
import { networkConfigForChainId } from '@/lib/config/app.config'

export function useNetworkConfig() {
  const { chain } = useNetwork()

  return networkConfigForChainId(chain?.id || 1)
}
