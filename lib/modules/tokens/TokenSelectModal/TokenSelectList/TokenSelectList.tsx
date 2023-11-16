'use client'

import { Box, BoxProps } from '@chakra-ui/react'
import { useTokens } from '../../useTokens'
import VirtualList from 'react-tiny-virtual-list'
import { TokenSelectListRow } from './TokenSelectListRow'

type Props = {
  listHeight: number
}

export function TokenSelectList({ listHeight, ...rest }: Props & BoxProps) {
  const { tokens } = useTokens()

  // Temp remove duplicates, should be fixed in API
  const _tokens = [...new Set(tokens)]

  return (
    <Box height={listHeight} {...rest}>
      <VirtualList
        width="100%"
        height={listHeight}
        itemCount={_tokens.length}
        itemSize={60}
        renderItem={({ index, style }) => {
          const token = _tokens[index]
          return (
            <TokenSelectListRow
              key={token.address + token.chain + index}
              token={token}
              style={style}
            />
          )
        }}
      />
    </Box>
  )
}
