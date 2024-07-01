import { useEffect, useState } from 'react'
import { useUserAccount } from './UserAccountProvider'

export function useSmartAccountMetadata() {
  const [walletName, setWalletName] = useState('')
  const { connector } = useUserAccount()

  useEffect(() => {
    if (!connector) return
    // for now we only support walletConnect metadata
    if (connector.id !== 'walletConnect') return
    connector.getProvider().then(provider => {
      const walletConnectProvider = provider as any
      // TODO: use @walletconnect/types EthereumProvider.
      // (see wagmi source code)
      let walletName = ''
      try {
        walletName = walletConnectProvider.session.peer.metadata.name
        console.log('Metadata: ', { walletName })
        setWalletName(walletName)
      } catch {
        console.error('Error getting wallet metadata')
      }
    })
  }, [connector])

  const isSafeWallet = walletName === 'Safe{Wallet}'

  return { walletName, isSafeWallet }
}
