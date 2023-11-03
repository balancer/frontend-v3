import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Box, Button, HStack, Img } from '@chakra-ui/react'
import { CustomAvatar } from './CustomAvatar'

export function ConnectWallet() {
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

        if (!isConnected) {
          return (
            <Button
              onClick={openConnectModal}
              type="button"
              isLoading={isLoading || !mounted}
              loadingText="Connect Wallet"
            >
              Connect Wallet
            </Button>
          )
        }

        if (chain.unsupported) {
          return (
            <Button onClick={openChainModal} type="button">
              Unsupported network
            </Button>
          )
        }

        return (
          <HStack spacing="sm">
            <Button onClick={openChainModal} display="flex" alignItems="center" type="button">
              {chain.hasIcon && (
                <Box width={6} height={6} borderRadius="full" overflow="hidden" marginRight="sm">
                  {chain.iconUrl && (
                    <Img
                      alt={chain.name ?? 'Chain icon'}
                      src={chain.iconUrl}
                      width={6}
                      height={6}
                    />
                  )}
                </Box>
              )}
              {chain.name}
            </Button>
            <Button onClick={openAccountModal}>
              <CustomAvatar
                ensImage={account.ensAvatar}
                address={account.address}
                alt="Avatar"
                size={6}
                rounded="full"
                marginRight="sm"
              />
              {account.displayName}
            </Button>
          </HStack>
        )
      }}
    </ConnectButton.Custom>
  )
}
