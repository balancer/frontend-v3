import { useNetwork } from 'wagmi'
import { getNetworkConfig } from '@/lib/config/app.config'

export function useNetworkConfig() {
  const { chain } = useNetwork()

  return getNetworkConfig(chain?.id)
}
