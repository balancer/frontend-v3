'use client'
import { Box, HStack, Text } from '@chakra-ui/react'
import { BalInput } from '../BalInput/BalInput'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import Image from 'next/image'

type Props = {
  token: GqlToken
  weight?: string
}

type TokenInputSelectorProps = {
  token: GqlToken
  weight?: string
}

function TokenInputSelector({ token, weight }: TokenInputSelectorProps) {
  return (
    <Box py="xs" px="sm" bg="sand.50" borderRadius="md">
      <HStack>
        {token?.logoURI && <Image src={token?.logoURI} alt={token.symbol} width={24} height={24} />}
        <Text fontWeight="bold">{token?.symbol}</Text>
        {weight && <Text fontWeight="normal">{weight}%</Text>}
      </HStack>
    </Box>
  )
}

export function TokenInput({ token, weight }: Props) {
  const tokenInputSelector = TokenInputSelector({ token, weight })
  const footer = <div>Footer</div>
  return <BalInput placeholder="0.00" footerSlot={footer} rightSlot={tokenInputSelector} />
}
