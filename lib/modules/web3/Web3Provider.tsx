'use client'

import { ReactQueryClientProvider } from '@/app/react-query.provider'
import { useIsMounted } from '@/lib/shared/hooks/useIsMounted'
import '@rainbow-me/rainbowkit/styles.css'
import { ConnectKitProvider } from 'connectkit'
import { PropsWithChildren } from 'react'
import { WagmiProvider } from 'wagmi'
import { UserSettingsProvider } from '../user/settings/UserSettingsProvider'
import { AcceptPoliciesModal } from './AcceptPoliciesModal'
import { BlockedAddressModal } from './BlockedAddressModal'
import { UserAccountProvider } from './UserAccountProvider'
import { WagmiConfig } from './WagmiConfig'

export function Web3Provider({
  children,
  wagmiConfig,
}: PropsWithChildren<{ wagmiConfig: WagmiConfig }>) {
  const isMounted = useIsMounted()

  if (!isMounted) return null

  return (
    <WagmiProvider config={wagmiConfig}>
      <ReactQueryClientProvider>
        <ConnectKitProvider>
          <UserAccountProvider>
            <UserSettingsProvider
              initCurrency={undefined}
              initSlippage={undefined}
              initEnableSignatures={undefined}
              initPoolListView={undefined}
              initAcceptedPolicies={undefined}
            >
              {children}

              <BlockedAddressModal />
              <AcceptPoliciesModal />
            </UserSettingsProvider>
          </UserAccountProvider>
        </ConnectKitProvider>
      </ReactQueryClientProvider>
    </WagmiProvider>
  )
}
