import { useNetwork } from 'wagmi'
import { getNetworkConfig } from '@/lib/config/app.config'
import { setTag } from '@sentry/nextjs'

export function useNetworkConfig() {
  const { chain } = useNetwork()

  setTag('walletNetwork', chain?.name || 'none')

  return getNetworkConfig(chain?.id)
}
