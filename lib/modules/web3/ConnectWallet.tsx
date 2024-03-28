import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Box, Button, HStack, Img } from '@chakra-ui/react'
import { CustomAvatar } from './CustomAvatar'
import { useUserAccount } from './useUserAccount'

export function ConnectWallet() {
  const { isLoading: isLoadingAccount, isConnected: isConnectedAccount } = useUserAccount()

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
        const isLoading = authenticationStatus === 'loading' || isLoadingAccount
        const isConnected =
          isReady &&
          account &&
          chain &&
          isConnectedAccount &&
          (!authenticationStatus || authenticationStatus === 'authenticated')

        if (!isConnected) {
          return (
            <Button
              variant="tertiary"
              onClick={openConnectModal}
              type="button"
              isDisabled={isLoading || !mounted}
              loadingText="Connect wallet"
            >
              Connect wallet
            </Button>
          )
        }

        if (chain.unsupported) {
          return (
            <Button onClick={openChainModal} type="button" variant="tertiary">
              Unsupported network
            </Button>
          )
        }

        return (
          <HStack spacing="sm">
            <Button
              onClick={openChainModal}
              display="flex"
              alignItems="center"
              type="button"
              variant="tertiary"
            >
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
            <Button onClick={openAccountModal} variant="tertiary">
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
