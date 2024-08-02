'use client'

import { ReactQueryClientProvider } from '@/app/react-query.provider'
import { useIsMounted } from '@/lib/shared/hooks/useIsMounted'
import { PropsWithChildren } from 'react'
import { WagmiProvider } from 'wagmi'
import { UserSettingsProvider } from '../user/settings/UserSettingsProvider'
import { AcceptPoliciesModal } from './AcceptPoliciesModal'
import { BlockedAddressModal } from './BlockedAddressModal'
import { UserAccountProvider } from './UserAccountProvider'
import { WalletConnectionProvider } from './WalletConnectionProvider'
import { wagmiConfigRainbow } from '@/lib/modules/web3/WagmiConfigRainbow'
import { wagmiConfigConnectKit } from '@/lib/modules/web3/WagmiConfigConnectKit'
import { useExperimentalConnectKit } from './useExperimentalConnectKit'

export function Web3Provider({ children }: PropsWithChildren) {
  const isMounted = useIsMounted()

  const { shouldUseConnectKit } = useExperimentalConnectKit()

  const wagmiConfig = shouldUseConnectKit ? wagmiConfigConnectKit : wagmiConfigRainbow

  if (!isMounted) return null

  return (
    <WagmiProvider config={wagmiConfig}>
      <ReactQueryClientProvider>
        <WalletConnectionProvider wagmiConfig={wagmiConfig}>
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
        </WalletConnectionProvider>
      </ReactQueryClientProvider>
    </WagmiProvider>
  )
}
