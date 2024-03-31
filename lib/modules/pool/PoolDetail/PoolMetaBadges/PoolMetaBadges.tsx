'use client'

import { Badge, HStack, Text, Tooltip } from '@chakra-ui/react'
import { usePool } from '../../usePool'
import { TokenIcon } from '@/lib/modules/tokens/TokenIcon'
import Image from 'next/image'
import { fNum } from '@/lib/shared/utils/numbers'
import { Repeat } from 'react-feather'

export default function PoolMetaBadges() {
  const { pool, chain } = usePool()

  return (
    <HStack>
      <Badge
        py="2.5"
        px="2.5"
        rounded="full"
        background="background.level2"
        border="1px solid"
        borderColor="border.base"
        shadow="sm"
      >
        <Image
          src={`/images/chains/${chain}.svg`}
          alt={`Chain icon for ${chain.toLowerCase()}`}
          width={20}
          height={20}
        />
      </Badge>
      {pool.displayTokens.map(token => {
        return (
          <Badge
            py="2"
            px="3"
            rounded="full"
            background="background.level2"
            border="1px solid"
            borderColor="border.base"
            key={`meta-badge-${token.address}`}
            shadow="sm"
          >
            <HStack>
              <TokenIcon
                chain={chain}
                address={token.address}
                size={24}
                alt={token?.symbol || token.address}
              />
              <Text fontSize="1rem">{token.symbol}</Text>
              {token.weight && (
                <Text fontWeight="normal" fontSize="1rem">
                  {fNum('weight', token.weight || 0)}
                </Text>
              )}
            </HStack>
          </Badge>
        )
      })}
      <Tooltip label="Swap fee">
        <Badge
          fontWeight="normal"
          py="xs"
          px="sm"
          background="background.level2"
          border="1px solid"
          borderColor="border.base"
          shadow="sm"
          rounded="full"
        >
          <HStack color="font.primary">
            <Repeat size={12} />
            <Text>{fNum('feePercent', pool.dynamicData.swapFee)}</Text>
          </HStack>
        </Badge>
      </Tooltip>
    </HStack>
  )
}
