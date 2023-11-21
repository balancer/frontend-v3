'use client'

import { Box, BoxProps } from '@chakra-ui/react'
import VirtualList from 'react-tiny-virtual-list'
import { TokenSelectListRow } from './TokenSelectListRow'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useTokenBalances } from '../../useTokenBalances'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { orderBy } from 'lodash'
import { useTokens } from '../../useTokens'

type Props = {
  tokens: GqlToken[]
  listHeight: number
  searchTerm?: string
  onTokenSelect: (token: GqlToken) => void
}

export function TokenSelectList({
  tokens,
  listHeight,
  searchTerm,
  onTokenSelect,
  ...rest
}: Props & BoxProps) {
  const { balanceFor, isBalancesLoading } = useTokenBalances(tokens)
  const { isConnected } = useUserAccount()
  const { usdValueForToken } = useTokens()

  const symbolMatch = (token: GqlToken, searchTerm: string) =>
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())

  const nameMatch = (token: GqlToken, searchTerm: string) =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase())

  const filteredTokens = searchTerm
    ? tokens.filter(token => {
        return (
          isSameAddress(token.address, searchTerm) ||
          symbolMatch(token, searchTerm) ||
          nameMatch(token, searchTerm)
        )
      })
    : tokens

  const orderedTokens = orderBy(
    filteredTokens,
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

  return (
    <Box height={listHeight} {...rest}>
      <VirtualList
        width="100%"
        height={listHeight}
        itemCount={orderedTokens.length}
        itemSize={60}
        renderItem={({ index, style }) => {
          const token = orderedTokens[index]
          const userBalance = isConnected ? balanceFor(token) : undefined

          return (
            <TokenSelectListRow
              key={token.address + token.chain + index}
              onClick={() => onTokenSelect(token)}
              token={token}
              userBalance={userBalance}
              isBalancesLoading={isBalancesLoading}
              style={style}
              pr="md"
            />
          )
        }}
      />
    </Box>
  )
}
