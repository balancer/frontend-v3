'use client'

import { isGyro, isLBP, isMetaStable, isPhantomStable, isStable, isWeighted } from '../pool.helpers'
import { Box, HStack, Tag, Text } from '@chakra-ui/react'
import { TokenIcon } from '../../tokens/TokenIcon'
import { PoolListItem } from '../pool.types'
import { GqlChain, GqlPoolTokenDisplay } from '@/lib/shared/services/api/generated/graphql'
import { fNum } from '@/lib/shared/utils/numbers'

interface Props {
  pool: PoolListItem
}

function PoolTokenIcon({
  token,
  chain,
  border,
}: {
  token: GqlPoolTokenDisplay
  chain: GqlChain
  border?: string
}) {
  return (
    <TokenIcon
      chain={chain}
      address={token.address}
      size={24}
      alt={token?.symbol || token.address}
      border={border}
    />
  )
}

function NestedTokens({
  nestedTokens,
  chain,
}: {
  nestedTokens: GqlPoolTokenDisplay[]
  chain: GqlChain
}) {
  return nestedTokens.map((nestedToken, idx) => (
    <Box key={nestedToken.address} ml={idx > 0 ? -3.5 : 0} zIndex={9999 - idx}>
      <PoolTokenIcon token={nestedToken} chain={chain} border="1px solid black" />
    </Box>
  ))
}

export function PoolListTokensTag({ pool }: Props) {
  if (pool) {
    if (isWeighted(pool.type) || isLBP(pool.type)) {
      return (
        <HStack spacing="1" wrap="wrap">
          {pool.displayTokens.map(token => {
            return (
              <Tag key={token.address} borderRadius="full" p="2">
                <HStack>
                  {token.nestedTokens ? (
                    <NestedTokens nestedTokens={token.nestedTokens} chain={pool.chain} />
                  ) : (
                    <PoolTokenIcon token={token} chain={pool.chain} />
                  )}
                  <Text>{token.nestedTokens ? token.name : token.symbol}</Text>
                  <Text>{fNum(token.weight || '', 'weight')}</Text>
                </HStack>
              </Tag>
            )
          })}
        </HStack>
      )
    } else if (isMetaStable(pool.type) || isGyro(pool.type)) {
      return (
        <Tag borderRadius="full" p="2">
          <HStack>
            {pool.displayTokens.map(token => (
              <HStack key={token.address} spacing="1">
                <PoolTokenIcon token={token} chain={pool.chain} />
                <Text>{token.symbol}</Text>
              </HStack>
            ))}
          </HStack>
        </Tag>
      )
    } else if (isStable(pool.type)) {
      return (
        <Tag borderRadius="full" p="2">
          <HStack spacing="2">
            {pool.displayTokens.map((token, idx) => (
              <Box key={token.address} ml={idx > 0 ? -1.5 : 0}>
                <PoolTokenIcon token={token} chain={pool.chain} />
              </Box>
            ))}
            <Text>{pool.name}</Text>
          </HStack>
        </Tag>
      )
    } else if (isPhantomStable(pool.type)) {
      return (
        <Tag borderRadius="full" p="2">
          <HStack spacing="1">
            {pool.displayTokens.map(token => {
              return (
                <HStack key={token.address}>
                  {token.nestedTokens ? (
                    <NestedTokens nestedTokens={token.nestedTokens} chain={pool.chain} />
                  ) : (
                    <PoolTokenIcon token={token} chain={pool.chain} />
                  )}
                  <Text>{token.nestedTokens ? token.name : token.symbol}</Text>
                </HStack>
              )
            })}
          </HStack>
        </Tag>
      )
    }
  }
}
