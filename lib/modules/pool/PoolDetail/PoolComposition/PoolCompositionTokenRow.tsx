/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { HStack, Heading, Skeleton, Text, Grid, GridItem } from '@chakra-ui/react'
import { Address } from 'viem'
import { GqlChain, GqlPoolTokenDetail } from '@/lib/shared/services/api/generated/graphql'
import { useEffect, useState } from 'react'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import { Numberish, fNum, isZero } from '@/lib/shared/utils/numbers'
import { TokenIcon } from '@/lib/modules/tokens/TokenIcon'
import { TokenInfoPopover } from '@/lib/modules/tokens/TokenInfoPopover'
import { useTokens } from '@/lib/modules/tokens/useTokens'
import { usePool } from '../../usePool'
import { isStableLike } from '../../pool.helpers'
import Image from 'next/image'
import { useBreakpoints } from '@/lib/shared/hooks/useBreakpoints'

type Props = {
  address: Address
  chain: GqlChain
  value: Numberish
  totalLiquidity: string
  poolToken: GqlPoolTokenDetail
  showZeroAmountAsDash?: boolean
}

export default function PoolCompositionTokenRow({
  address,
  value,
  totalLiquidity,
  poolToken,
  chain,
  showZeroAmountAsDash = false,
}: Props) {
  const { getToken, usdValueForToken, getPoolTokenWeightByBalance } = useTokens()
  const { toCurrency } = useCurrency()
  const [amount, setAmount] = useState<string>('')
  const [usdValue, setUsdValue] = useState<string | undefined>(undefined)
  const { pool, isLoading } = usePool()
  const { isMobile } = useBreakpoints()
  const token = getToken(address, chain)
  const showWeightDistribution = !isStableLike(pool.type)

  useEffect(() => {
    if (value && token) {
      setUsdValue(usdValueForToken(token, value))
      setAmount(fNum('token', value, { abbreviated: false }))
    }
  }, [value])

  return isLoading ? (
    <Skeleton w="full" h="50px" />
  ) : (
    <Grid
      w="full"
      templateRows={{
        base: `repeat(${showWeightDistribution ? '3' : '2'}, 1fr)`,
        md: 'repeat(2, 1fr)',
      }}
      templateColumns={{
        base: '30px repeat(3, 1fr)',
        md: `50px repeat(${showWeightDistribution ? '4' : '3'}, 1fr)`,
      }}
      templateAreas={{
        base: `"icon symbol . amount"
               "name name   . usd"
               "desc desc   . weight"`,
        md: `"icon symbol . amount ${showWeightDistribution ? 'calculated' : ''}"
             "icon name   . usd    ${showWeightDistribution ? 'weight' : ''}"`,
      }}
      alignItems="center"
    >
      <GridItem area="icon">
        <TokenIcon
          chain={chain}
          address={address}
          size={isMobile ? 20 : 40}
          alt={token?.symbol || address}
        />
      </GridItem>
      <GridItem area="symbol">
        <HStack spacing="none">
          <Heading fontWeight="bold" as="h6" fontSize="lg" variant="primary">
            {token?.symbol}
          </Heading>
          <TokenInfoPopover tokenAddress={address} chain={chain} />
        </HStack>
      </GridItem>
      <GridItem area="name">
        <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
          {token?.name}
        </Text>
      </GridItem>
      <GridItem area="amount" justifySelf="end">
        <Heading fontWeight="bold" as="h6" fontSize="lg">
          {isZero(amount) && showZeroAmountAsDash ? '-' : amount ? amount : '0'}
        </Heading>
      </GridItem>
      <GridItem area="usd" justifySelf="end">
        <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
          {showZeroAmountAsDash && usdValue && isZero(usdValue)
            ? '-'
            : toCurrency(usdValue ?? '0', { abbreviated: false })}
        </Text>
      </GridItem>
      {showWeightDistribution && (
        <>
          <GridItem area="calculated" display={{ base: 'none', md: 'block' }} justifySelf="end">
            <Heading fontWeight="bold" as="h6" fontSize="1rem">
              {totalLiquidity ? (
                fNum('weight', getPoolTokenWeightByBalance(totalLiquidity, poolToken, chain), {
                  abbreviated: false,
                })
              ) : (
                <Skeleton height="24px" w="75px" />
              )}
            </Heading>
          </GridItem>
          <GridItem area="desc" display={{ base: 'block', md: 'none' }}>
            <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
              Token weight
            </Text>
          </GridItem>
          <GridItem area="weight" justifySelf="end">
            <HStack spacing="1">
              <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
                {fNum('weight', poolToken.weight || '0', { abbreviated: false })}
              </Text>
              <Image
                src="/images/icons/bullseye.svg"
                width="16"
                height="16"
                alt="Token weight - Bullseye"
              />
            </HStack>
          </GridItem>
        </>
      )}
    </Grid>
  )
}
