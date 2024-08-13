import { useNetworkConfig } from '@/lib/config/useNetworkConfig'

export function useFeatures() {
  const networkConfig = useNetworkConfig()

  return networkConfig.features
}
