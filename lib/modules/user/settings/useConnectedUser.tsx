/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import React, { PropsWithChildren } from 'react'
import { Address } from 'wagmi'
import { useUserAccount } from '../../web3/useUserAccount'
import { Text } from '@chakra-ui/react'
import { ConnectWallet } from '../../web3/ConnectWallet'

const ConnectedUserContext = React.createContext<Address | null>(null)

export function ConnectedUserProvider({ children }: PropsWithChildren) {
  const { address: userAddress, isLoading } = useUserAccount()
  if (isLoading) {
    // TODO: add loading Skeleton
    return <Text>Connecting...</Text>
  }
  if (!userAddress) {
    return <ConnectWallet />
  }

  if (userAddress) {
    return (
      <ConnectedUserContext.Provider value={userAddress}>{children}</ConnectedUserContext.Provider>
    )
  }
}

export const useConnectedUser = (): Address =>
  useMandatoryContext(ConnectedUserContext, 'ConnectedUser')
