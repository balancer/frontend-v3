import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Button, Flex } from '@chakra-ui/react'

export function Connect() {
  return (
    <ConnectButton.Custom>
      {({
        mounted,
        openConnectModal,
        authenticationStatus,
        account,
        chain,
        openChainModal,
        openAccountModal,
      }) => {
        const isReady = mounted && authenticationStatus !== 'loading'
        const isLoading = authenticationStatus === 'loading'
        const isConnected =
          isReady &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated')

        if (isLoading || !mounted) {
          return <Button isLoading type="button" />
        }

        if (!isConnected) {
          return (
            <Button onClick={openConnectModal} type="button">
              Connect
            </Button>
          )
        }

        const balance = account.displayBalance ? ` (${account.displayBalance})` : ''

        if (chain.unsupported) {
          return (
            <Button onClick={openChainModal} type="button">
              Wrong network
            </Button>
          )
        }
        return (
          <Flex>
            <Button
              onClick={openChainModal}
              display="flex"
              alignItems="center"
              type="button"
              variant="ghost"
            >
              {chain.name} chain
            </Button>
            <Button onClick={openAccountModal} variant="ghost">
              {account.displayName}
              {balance}
            </Button>
          </Flex>
        )
      }}
    </ConnectButton.Custom>
  )
}
