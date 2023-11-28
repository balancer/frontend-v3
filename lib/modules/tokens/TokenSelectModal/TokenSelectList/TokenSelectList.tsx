'use client'

import { Box, BoxProps, Center, Text } from '@chakra-ui/react'
import VirtualList from 'react-tiny-virtual-list'
import { TokenSelectListRow } from './TokenSelectListRow'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useTokenBalances } from '../../useTokenBalances'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTokenSelectList } from './useTokenSelectList'

type Props = {
  tokens: GqlToken[]
  excludeNativeAsset?: boolean
  pinNativeAsset?: boolean
  listHeight: number
  searchTerm?: string
  onTokenSelect: (token: GqlToken) => void
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

  const decrementActiveIndex = () => setActiveIndex(prev => Math.max(prev - 1, 0))
  const incrementActiveIndex = () =>
    setActiveIndex(prev => Math.min(prev + 1, orderedTokens.length - 1))
  const hotkeyOpts = { enableOnFormTags: true }

  const selectActiveToken = () => {
    onTokenSelect(orderedTokens[activeIndex])
  }

  useHotkeys('up', decrementActiveIndex, hotkeyOpts)
  useHotkeys('shift+tab', decrementActiveIndex, hotkeyOpts)
  useHotkeys('down', incrementActiveIndex, hotkeyOpts)
  useHotkeys('tab', incrementActiveIndex, hotkeyOpts)
  useHotkeys('enter', selectActiveToken, [orderedTokens, activeIndex], hotkeyOpts)

  function keyFor(token: GqlToken, index: number) {
    return `${token.address}:${token.chain}:${index}`
  }

  function getScrollToIndex() {
    if (orderedTokens.length === 0) return undefined

    return activeIndex >= 8 ? activeIndex - 7 : 0
  }

  return (
    <Box height={listHeight} {...rest}>
      {orderedTokens.length === 0 ? (
        <Center h="60">
          <Text color="gray.500" fontSize="sm">
            No tokens found
          </Text>
        </Center>
      ) : (
        <VirtualList
          width="100%"
          height={listHeight}
          itemCount={orderedTokens.length}
          itemSize={60}
          scrollToIndex={getScrollToIndex()}
          style={{ overflowY: 'scroll' }}
          renderItem={({ index, style }) => {
            const token = orderedTokens[index]
            const userBalance = isConnected ? balanceFor(token) : undefined

            return (
              <TokenSelectListRow
                key={keyFor(token, index)}
                active={index === activeIndex}
                onClick={() => onTokenSelect(token)}
                token={token}
                userBalance={userBalance}
                isBalancesLoading={isBalancesLoading}
                style={style}
              />
            )
          }}
        />
      )}
    </Box>
  )
}
