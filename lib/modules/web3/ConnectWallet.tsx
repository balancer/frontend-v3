import { ChainIcon, ConnectKitButton } from 'connectkit'

import { ButtonProps, HStack } from '@chakra-ui/react'
import { useUserAccount } from './UserAccountProvider'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ConnectWallet({ ...rest }: ButtonProps) {
  const { chainId } = useUserAccount()

  return (
    <HStack>
      <ChainIcon id={chainId} />
      <ConnectKitButton />
    </HStack>
  )
}
