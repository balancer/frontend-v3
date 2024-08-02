'use client'

import { ChainIcon, ConnectKitButton } from 'connectkit'

import { ButtonProps, HStack } from '@chakra-ui/react'
import { useUserAccount } from './UserAccountProvider'
import { RainbowConnectWallet } from './connect-button/RainbowButton'
import { useExperimentalConnectKit } from './useExperimentalConnectKit'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ConnectWallet(props: ButtonProps) {
  const { chainId } = useUserAccount()

  const { shouldUseConnectKit } = useExperimentalConnectKit()

  if (shouldUseConnectKit) {
    return (
      <HStack>
        <ChainIcon id={chainId} />
        <ConnectKitButton />
      </HStack>
    )
  }
  return <RainbowConnectWallet {...props}></RainbowConnectWallet>
}
