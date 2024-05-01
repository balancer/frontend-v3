/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import TokenRow from '@/lib/modules/tokens/TokenRow/TokenRow'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { Card, Text, VStack, useDisclosure } from '@chakra-ui/react'
import { Address } from 'viem'
import { useRemoveLiquidity } from '../useRemoveLiquidity'
import { isNativeAsset, isNativeOrWrappedNative } from '@/lib/modules/tokens/token.helpers'
import { NativeAssetSelectModal } from '@/lib/modules/tokens/NativeAssetSelectModal'

export function RemoveLiquidityProportional({ tokens }: { tokens: (GqlToken | undefined)[] }) {
  const { amountOutForToken, validTokens, setWethIsEth, simulationQuery, priceImpactQuery } =
    useRemoveLiquidity()
  const tokenSelectDisclosure = useDisclosure()
  const isLoading = simulationQuery.isLoading || priceImpactQuery.isLoading

  const nativeAssets = validTokens.filter(token =>
    isNativeOrWrappedNative(token.address as Address, token.chain)
  )

  function handleTokenSelect(token: GqlToken) {
    if (isNativeAsset(token.address as Address, token.chain)) {
      setWethIsEth(true)
    } else {
      setWethIsEth(false)
    }
  }

  return (
    <>
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
                  toggleTokenSelect={
                    isNativeOrWrappedNative(token.address as Address, token.chain)
                      ? () => tokenSelectDisclosure.onOpen()
                      : undefined
                  }
                  isLoading={isLoading}
                />
              )
          )}
        </VStack>
      </Card>
      {!!validTokens.length && (
        <NativeAssetSelectModal
          chain={validTokens[0].chain}
          isOpen={tokenSelectDisclosure.isOpen}
          onOpen={tokenSelectDisclosure.onOpen}
          onClose={tokenSelectDisclosure.onClose}
          onTokenSelect={handleTokenSelect}
          nativeAssets={nativeAssets}
        />
      )}
    </>
  )
}
