'use client'

import { Box, BoxProps } from '@chakra-ui/react'
import VirtualList from 'react-tiny-virtual-list'
import { TokenSelectListRow } from './TokenSelectListRow'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useTokenBalances } from '../../useTokenBalances'
import { useEffect } from 'react'

type Props = {
  tokens: GqlToken[]
  listHeight: number
  searchTerm?: string
}

export function TokenSelectList({ tokens, listHeight, searchTerm, ...rest }: Props & BoxProps) {
  const { balanceFor, balances, isBalancesLoading } = useTokenBalances(tokens)

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

  useEffect(() => {
    console.log(balances)
  }, [balances])

  return (
    <Box height={listHeight} {...rest}>
      <VirtualList
        width="100%"
        height={listHeight}
        itemCount={filteredTokens.length}
        itemSize={60}
        renderItem={({ index, style }) => {
          const token = filteredTokens[index]
          const userBalance = balanceFor(token)
          console.log(userBalance)

          return (
            <TokenSelectListRow
              key={token.address + token.chain + index}
              token={token}
              userBalance={userBalance}
              isBalancesLoading={isBalancesLoading}
              style={style}
            />
          )
        }}
      />
    </Box>
  )
}
