/* eslint-disable react-hooks/exhaustive-deps */
import { Connector, useConnect } from 'wagmi'
import { useEffect } from 'react'

/*
  If the app is running as a Safe App and an EOA connection is created in another tab,
  this hook will ensure that the Safe App tab keeps connected to the Safe account.
*/
export function useSafeAppConnectionGuard(newConnector?: Connector, chainId?: number) {
  const { connect, connectors } = useConnect()
  useEffect(() => {
    const safeConnector = connectors.find(c => c.id === 'safe')
    if (newConnector && newConnector?.id !== 'safe' && safeConnector) {
      connect({ chainId, connector: safeConnector })
    }
  }, [newConnector])
}
