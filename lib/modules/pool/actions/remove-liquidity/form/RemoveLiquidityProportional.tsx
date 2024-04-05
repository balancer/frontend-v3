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
  const { amountOutForToken } = useRemoveLiquidity()

  return (
    <Card variant="subSection">
      <VStack spacing="md" align="start">
        <Text fontWeight="bold" fontSize="sm">
          You&apos;re expected to get (if no slippage)
        </Text>
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
