'use client'

import { isMetaStable, isStable, isWeighted } from '../pool.helpers'
import { HStack, Tag, Text } from '@chakra-ui/react'
import { TokenIcon } from '../../tokens/TokenIcon'
import { PoolListItem } from '../pool.types'
import numeral from 'numeral'

interface Props {
  pool: PoolListItem
}

export function PoolTokensTag({ pool }: Props) {
  if (pool && isWeighted(pool.type)) {
    return (
      <HStack spacing="1">
        {pool.displayTokens.map(token => {
          return (
            <>
              <Tag key={token.address} borderRadius="full" p="2">
                <HStack>
                  <TokenIcon
                    chain={pool.chain}
                    address={token.address}
                    size={24}
                    alt={token?.symbol || token.address}
                  />
                  <Text>{token.symbol}</Text>
                  <Text>{numeral(token.weight).format('%')}</Text>
                </HStack>
              </Tag>
            </>
          )
        })}
      </HStack>
    )
  } else if (pool && isMetaStable(pool.type)) {
    return (
      <Tag borderRadius="full" p="2">
        <HStack>
          {pool.displayTokens.map(token => {
            return (
              <HStack key={token.address} spacing="1">
                <TokenIcon
                  chain={pool.chain}
                  address={token.address}
                  size={24}
                  alt={token?.symbol || token.address}
                />
                <Text>{token.symbol}</Text>
              </HStack>
            )
          })}
        </HStack>
      </Tag>
    )
  } else if (pool && isStable(pool.type)) {
    return (
      <Tag borderRadius="full" p="2">
        <HStack spacing="1">
          {pool.displayTokens.map(token => {
            return (
              <TokenIcon
                key={token.address}
                chain={pool.chain}
                address={token.address}
                size={24}
                alt={token?.symbol || token.address}
              />
            )
          })}
          <Text>{pool.name}</Text>
        </HStack>
      </Tag>
    )
  }
}
