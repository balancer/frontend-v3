import { useNetwork } from 'wagmi'
import { getNetworkConfig } from '@/lib/config/app.config'
import { setTag } from '@sentry/nextjs'
import { useEffect } from 'react'

export function useNetworkConfig() {
  const { chain } = useNetwork()

  useEffect(() => {
    setTag('walletNetwork', chain?.name)
  }, [chain])

  return getNetworkConfig(chain?.id)
}
