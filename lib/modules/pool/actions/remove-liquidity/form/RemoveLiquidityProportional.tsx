/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { fNum } from '@/lib/shared/utils/numbers'
import { Card, HStack, Text, VStack } from '@chakra-ui/react'
import { Address } from 'viem'
import { useRemoveLiquidity } from '../useRemoveLiquidity'

export function RemoveLiquidityProportional({ tokens }: { tokens: (GqlToken | undefined)[] }) {
  const { slippage } = useUserSettings()
  const { amountOutForToken } = useRemoveLiquidity()

  return (
    <Card variant="level8" p="md" shadow="sm" w="full">
      <VStack spacing="md">
        <HStack w="full" justify="space-between">
          <Text fontWeight="bold" fontSize="1rem">
            You&apos;ll get at least
          </Text>
          <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
            With max slippage: {fNum('slippage', slippage)}
          </Text>
        </HStack>
        {tokens.map(
          token =>
            token && (
              <TokenRow
                chain={token.chain}
                key={token.address}
                address={token.address as Address}
                value={amountOutForToken(token.address as Address)}
              />
            )
        )}
      </VStack>
    </Card>
  )
}
