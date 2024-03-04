'use client'

import { Box, BoxProps, Button, Card, Center, HStack, Text } from '@chakra-ui/react'
import { TokenSelectListRow } from './TokenSelectListRow'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useTokenBalances } from '../../useTokenBalances'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTokenSelectList } from './useTokenSelectList'
import { TbCoins, TbWallet } from 'react-icons/tb'
import { GroupedVirtuoso } from 'react-virtuoso'
import { useConnectModal } from '@rainbow-me/rainbowkit'

type Props = {
  tokens: GqlToken[]
  excludeNativeAsset?: boolean
  pinNativeAsset?: boolean
  listHeight: number
  searchTerm?: string
  onTokenSelect: (token: GqlToken) => void
}
function OtherTokens() {
  return (
    <Card p="1" my="2">
      <HStack>
        <Box color="font.secondary">
          <TbCoins />
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
    <>
      <Card p="1" pr="4" mb="2">
        <HStack>
          <Box color="font.secondary">
            <TbWallet />
          </Box>
          <Text color="font.secondary">In your wallet</Text>
          {!isConnected && (
            <Button ml="auto" variant="link" color="purple.300" onClick={openConnectModal}>
              Connect wallet
            </Button>
          )}
        </HStack>
      </Card>
      {isConnected && hasNoTokensInWallet && <Text>No tokens in your wallet</Text>}
    </>
  )
}

export function TokenSelectList({
  tokens,
  excludeNativeAsset = false,
  pinNativeAsset = false,
  listHeight,
  searchTerm,
  onTokenSelect,
  ...rest
}: Props & BoxProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const { balanceFor, isBalancesLoading } = useTokenBalances()
  const { isConnected } = useUserAccount()
  const { orderedTokens } = useTokenSelectList(
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
      isConnected={isConnected}
      openConnectModal={openConnectModal}
      hasNoTokensInWallet={!tokensWithBalance.length}
    />,
    <OtherTokens />,
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

  function keyFor(token: GqlToken, index: number) {
    return `${token.address}:${token.chain}:${index}`
  }

  function getScrollToIndex() {
    if (tokensToShow.length === 0) return undefined

    return activeIndex >= 8 ? activeIndex - 7 : 0
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
          groupCounts={groupCounts}
          style={{ height: listHeight }}
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
