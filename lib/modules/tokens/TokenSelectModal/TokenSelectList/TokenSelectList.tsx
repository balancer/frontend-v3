'use client'

import { Box, BoxProps, Button, Card, Center, HStack, Text } from '@chakra-ui/react'
import { TokenSelectListRow } from './TokenSelectListRow'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useTokenBalances } from '../../useTokenBalances'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTokenSelectList } from './useTokenSelectList'
import { GroupedVirtuoso, GroupedVirtuosoHandle } from 'react-virtuoso'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { CoinsIcon } from '@/lib/shared/components/icons/CoinsIcon'
import { WalletIcon } from '@/lib/shared/components/icons/WalletIcon'

type Props = {
  chain: GqlChain
  tokens: GqlToken[]
  excludeNativeAsset?: boolean
  pinNativeAsset?: boolean
  listHeight: number
  searchTerm?: string
  onTokenSelect: (token: GqlToken) => void
}
function OtherTokens() {
  return (
    <Card padding="xs" px="md" my="2">
      <HStack>
        <Box color="font.secondary">
          <CoinsIcon />
        </Box>
        <Text color="font.secondary">Other tokens</Text>
      </HStack>
    </Card>
  )
}

interface InYourWalletProps {
  isConnected: boolean
  openConnectModal: (() => void) | undefined
  hasNoTokensInWallet: boolean
}

function InYourWallet({ isConnected, openConnectModal, hasNoTokensInWallet }: InYourWalletProps) {
  return (
    <Box pb="xs">
      <Card padding="xs" px="md" mt="px">
        <HStack>
          <Box color="font.secondary">
            <WalletIcon />
          </Box>
          <Text color="font.secondary">In your wallet</Text>
          {!isConnected && (
            <Button
              ml="auto"
              size="sm"
              variant="link"
              color="purple.300"
              onClick={openConnectModal}
            >
              Connect wallet
            </Button>
          )}
        </HStack>
      </Card>
      {isConnected && hasNoTokensInWallet && <Text>No tokens in your wallet</Text>}
    </Box>
  )
}

export function TokenSelectList({
  chain,
  tokens,
  excludeNativeAsset = false,
  pinNativeAsset = false,
  listHeight,
  searchTerm,
  onTokenSelect,
  ...rest
}: Props & BoxProps) {
  const ref = useRef<GroupedVirtuosoHandle>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const { balanceFor, isBalancesLoading } = useTokenBalances()
  const { isConnected } = useUserAccount()
  const { orderedTokens } = useTokenSelectList(
    chain,
    tokens,
    excludeNativeAsset,
    pinNativeAsset,
    searchTerm
  )
  const { openConnectModal } = useConnectModal()

  const tokensWithBalance = isConnected
    ? orderedTokens.filter(token => balanceFor(token)?.amount)
    : []
  const tokensWithoutBalance = orderedTokens.filter(token => !tokensWithBalance.includes(token))
  const tokensToShow = [...tokensWithBalance, ...tokensWithoutBalance]

  const groups = [
    <InYourWallet
      key="in-your-wallet"
      isConnected={isConnected}
      openConnectModal={openConnectModal}
      hasNoTokensInWallet={!tokensWithBalance.length}
    />,
    <OtherTokens key="other-tokens" />,
  ]
  const groupCounts = [tokensWithBalance.length, tokensWithoutBalance.length]

  const decrementActiveIndex = () => setActiveIndex(prev => Math.max(prev - 1, 0))
  const incrementActiveIndex = () =>
    setActiveIndex(prev => Math.min(prev + 1, tokensToShow.length - 1))
  const hotkeyOpts = { enableOnFormTags: true }

  const selectActiveToken = () => {
    onTokenSelect(tokensToShow[activeIndex])
  }

  useHotkeys('up', decrementActiveIndex, hotkeyOpts)
  useHotkeys('shift+tab', decrementActiveIndex, hotkeyOpts)
  useHotkeys('down', incrementActiveIndex, hotkeyOpts)
  useHotkeys('tab', incrementActiveIndex, hotkeyOpts)
  useHotkeys('enter', selectActiveToken, [tokensToShow, activeIndex], hotkeyOpts)

  useEffect(() => {
    ref.current?.scrollIntoView({ index: activeIndex, behavior: 'auto' })
  }, [activeIndex])

  function keyFor(token: GqlToken, index: number) {
    return `${token.address}:${token.chain}:${index}`
  }

  return (
    <Box height={listHeight} {...rest}>
      {tokensToShow.length === 0 ? (
        <Center h="60">
          <Text color="gray.500" fontSize="sm">
            No tokens found
          </Text>
        </Center>
      ) : (
        <GroupedVirtuoso
          ref={ref}
          groupCounts={groupCounts}
          style={{ height: listHeight, paddingRight: '0.25rem' }}
          groupContent={index => {
            return groups[index]
          }}
          itemContent={index => {
            const token = tokensToShow[index]
            const userBalance = isConnected ? balanceFor(token) : undefined

            return (
              <TokenSelectListRow
                key={keyFor(token, index)}
                active={index === activeIndex}
                onClick={() => onTokenSelect(token)}
                token={token}
                userBalance={userBalance}
                isBalancesLoading={isBalancesLoading}
              />
            )
          }}
        />
      )}
    </Box>
  )
}
