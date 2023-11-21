'use client'

import { Box, BoxProps, Center, Text } from '@chakra-ui/react'
import VirtualList from 'react-tiny-virtual-list'
import { TokenSelectListRow } from './TokenSelectListRow'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useTokenBalances } from '../../useTokenBalances'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { orderBy } from 'lodash'
import { useTokens } from '../../useTokens'
import { useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

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
  const { balanceFor, isBalancesLoading } = useTokenBalances(tokens)
  const { isConnected } = useUserAccount()
  const { usdValueForToken, exclNativeAssetFilter, nativeAssetFilter } = useTokens()

  const symbolMatch = (token: GqlToken, searchTerm: string) =>
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())

  const nameMatch = (token: GqlToken, searchTerm: string) =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase())

  const getFilteredTokens = () => {
    let filteredTokens = tokens

    if (excludeNativeAsset) {
      filteredTokens = filteredTokens.filter(exclNativeAssetFilter)
    }

    if (searchTerm) {
      filteredTokens = filteredTokens.filter(token => {
        return (
          isSameAddress(token.address, searchTerm) ||
          symbolMatch(token, searchTerm) ||
          nameMatch(token, searchTerm)
        )
      })
    }

    return filteredTokens
  }

  let orderedTokens = orderBy(
    getFilteredTokens(),
    [
      token => {
        const userBalance = balanceFor(token)
        return userBalance ? Number(usdValueForToken(token, userBalance?.formatted || 0)) : 0
      },
      'priority',
      'symbol',
    ],
    ['desc', 'desc']
  )

  if (pinNativeAsset) {
    const nativeAsset = orderedTokens.find(nativeAssetFilter)

    if (nativeAsset) {
      orderedTokens = [nativeAsset, ...orderedTokens.filter(exclNativeAssetFilter)]
    }
  }

  const decrementActiveIndex = () => setActiveIndex(prev => Math.max(prev - 1, 0))
  const incrementActiveIndex = () =>
    setActiveIndex(prev => Math.min(prev + 1, orderedTokens.length - 1))
  const hotkeyOpts = { enableOnFormTags: true }

  useHotkeys('up', decrementActiveIndex, hotkeyOpts)
  useHotkeys('shift+tab', decrementActiveIndex, hotkeyOpts)
  useHotkeys('down', incrementActiveIndex, hotkeyOpts)
  useHotkeys('tab', incrementActiveIndex, hotkeyOpts)
  useHotkeys('enter', () => onTokenSelect(orderedTokens[activeIndex]), [activeIndex], hotkeyOpts)

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
