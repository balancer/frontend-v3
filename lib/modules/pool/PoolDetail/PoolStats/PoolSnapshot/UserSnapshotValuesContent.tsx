'use client'

import React, { memo } from 'react'
import {
  Button,
  HStack,
  Heading,
  Skeleton,
  Text,
  Tooltip,
  UseDisclosureProps,
  VStack,
} from '@chakra-ui/react'
import { TokenIconStack } from '../../../../tokens/TokenIconStack'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { usePool } from '../../../PoolProvider'
import { ClaimModal } from '../../../actions/claim/ClaimModal'
import MainAprTooltip from '@/lib/shared/components/tooltips/apr-tooltip/MainAprTooltip'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'

export type PoolMyStatsValues = {
  myLiquidity: number
  myPotentialWeeklyYield: string
  myClaimableRewards: number
}

export type UserSnapshotValuesContentProps = {
  poolMyStatsValues?: PoolMyStatsValues | undefined
  boost: string | undefined
  hasNoRewards: boolean
  tokens: GqlToken[]
  isDisabled: boolean
  disabledReason: string | undefined
  modal: UseDisclosureProps
}

export function UserSnapshotValuesContent({
  poolMyStatsValues,
  boost,
  hasNoRewards,
  tokens,
  isDisabled,
  disabledReason,
  modal,
}: UserSnapshotValuesContentProps) {
  const { pool, chain, myLiquiditySectionRef } = usePool()
  const { toCurrency } = useCurrency()

  const MemoizedMainAprTooltip = memo(MainAprTooltip)

  function onModalClose() {
    modal.onClose && modal.onClose()
  }

  function handleClick() {
    myLiquiditySectionRef?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondary" fontWeight="semibold" fontSize="sm" mt="xxs">
          My liquidity
        </Text>
        {poolMyStatsValues ? (
          poolMyStatsValues.myLiquidity ? (
            <HStack onClick={handleClick}>
              <Heading cursor="pointer" size="h4">
                {toCurrency(poolMyStatsValues.myLiquidity)}
              </Heading>
              <Text
                color="font.link"
                cursor="pointer"
                opacity="0"
                fontSize="sm"
                transition="opacity 0.2s var(--ease-out-cubic)"
                _groupHover={{ opacity: '1' }}
              >
                Manage
              </Text>
            </HStack>
          ) : (
            <Heading size="h4">&mdash;</Heading>
          )
        ) : (
          <Skeleton height="28px" w="100px" />
        )}
      </VStack>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondary" fontWeight="semibold" fontSize="sm" mt="xxs">
          My APR
        </Text>
        {poolMyStatsValues && poolMyStatsValues.myLiquidity ? (
          <MemoizedMainAprTooltip
            aprItems={pool.dynamicData.aprItems}
            poolId={pool.id}
            textProps={{ fontWeight: 'bold', fontSize: '2xl', lineHeight: '28px' }}
            vebalBoost={boost || '1'}
            pool={pool}
          />
        ) : (
          <Heading size="h4">&mdash;</Heading>
        )}
      </VStack>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondary" fontWeight="semibold" fontSize="sm" mt="xxs">
          {`My potential weekly yield${
            poolMyStatsValues && !poolMyStatsValues.myLiquidity ? ' on $10k' : ''
          }`}
        </Text>
        {poolMyStatsValues ? (
          <Heading size="h4">{toCurrency(poolMyStatsValues.myPotentialWeeklyYield)}</Heading>
        ) : (
          <Skeleton height="28px" w="100px" />
        )}
      </VStack>
      <VStack spacing="0" align="flex-start" w="full">
        <Text variant="secondary" fontWeight="semibold" fontSize="sm" mt="xxs">
          My claimable rewards
        </Text>
        {poolMyStatsValues ? (
          hasNoRewards ? (
            <Heading size="h4">&mdash;</Heading>
          ) : (
            <HStack>
              <Heading size="h4">{toCurrency(poolMyStatsValues.myClaimableRewards)}</Heading>
              <TokenIconStack tokens={tokens} chain={chain} size={20} />
              <Tooltip label={isDisabled ? disabledReason : ''}>
                <Button
                  variant="primary"
                  w="full"
                  size="xxs"
                  isDisabled={isDisabled}
                  onClick={() => !isDisabled && modal.onOpen && modal.onOpen()}
                >
                  Claim
                </Button>
              </Tooltip>
            </HStack>
          )
        ) : (
          <Skeleton height="28px" w="100px" />
        )}
      </VStack>
      <ClaimModal isOpen={!!modal.isOpen} onClose={onModalClose} chain={pool.chain} />
    </>
  )
}
