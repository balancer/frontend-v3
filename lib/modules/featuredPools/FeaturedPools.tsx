'use client'

import { Card, Center, Grid, GridItem, HStack, Heading, Text, VStack } from '@chakra-ui/react'
import { useFeaturedPools } from './useFeaturedPools'
import { GqlChain, GqlPoolUnion } from '@/lib/shared/services/api/generated/graphql'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import {
  poolClickHandler,
  poolMouseEnterHandler,
  getAprLabel,
  getPoolTypeLabel,
} from '../pool/pool.utils'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import PoolWeightChart from '../pool/PoolDetail/PoolWeightCharts/PoolWeightChart'
import { useRouter } from 'next/navigation'
import { PoolName } from '../pool/PoolName'

const indexAreaHash: { [key: number]: string } = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
}

interface FeaturedPoolCardProps {
  pool: GqlPoolUnion
  chain: GqlChain
  isSmall?: boolean
  hasLegend?: boolean
}

function FeaturedPoolCard({
  pool,
  chain,
  isSmall = false,
  hasLegend = false,
}: FeaturedPoolCardProps) {
  const { toCurrency } = useCurrency()
  const router = useRouter()

  return (
    <Card
      variant="gradient"
      h="full"
      w="full"
      p="4"
      cursor="pointer"
      onClick={event => poolClickHandler(event, pool.id, pool.chain, router)}
      onMouseEnter={event => poolMouseEnterHandler(event, pool.id, pool.chain, router)}
    >
      <VStack justifyContent="space-between" h="full">
        <HStack justifyContent="center" w="full" spacing="sm">
          <Text variant="secondary" fontWeight="medium">
            {getPoolTypeLabel(pool.type)}
          </Text>
          <Text variant="secondary" fontWeight="medium">
            &#x2022;
          </Text>
          <Text variant="secondary" fontWeight="medium">
            {toCurrency(pool.dynamicData.totalLiquidity)} TVL
          </Text>
        </HStack>
        <PoolWeightChart pool={pool} chain={chain} hasLegend={hasLegend} isSmall={isSmall} />
        <Center>
          <VStack>
            <PoolName pool={pool} fontWeight="bold" fontSize="lg" noOfLines={1} />
            <Text variant="secondary" fontWeight="medium">
              {getAprLabel(pool.dynamicData.apr.apr)} APR
            </Text>
          </VStack>
        </Center>
      </VStack>
    </Card>
  )
}

export function FeaturedPools() {
  const { featuredPools: allFeaturedPools } = useFeaturedPools()
  const { projectName } = getProjectConfig()

  const featuredPools = allFeaturedPools.slice(0, 5)
  const primaryPool = featuredPools.find(featured => featured.primary)?.pool
  const poolsWithoutPrimary = featuredPools
    .filter(featured => !featured.primary)
    .map(featured => featured.pool)

  return (
    <VStack align="start" w="full">
      <Grid
        w="full"
        minH="600px"
        gap="4"
        alignContent="stretch"
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)', // align with PoolListCards
        }}
        templateAreas={{
          base: `"primary"
                 "one"
                 "two"
                 "three"
                 "four"`,
          md: `"primary primary"
               "one     two"
               "three   four"`,
          lg: `"primary primary one   two"
               "primary primary three four"`, // align with PoolListCards
        }}
      >
        <GridItem area="primary">
          {primaryPool && (
            <VStack align="start" w="full" h="full" spacing="xl">
              <Heading as="h2" size="xl" variant="special">
                Featured pools on<br></br> {projectName} protocol
              </Heading>
              <FeaturedPoolCard pool={primaryPool} chain={primaryPool.chain} hasLegend />
            </VStack>
          )}
        </GridItem>
        {poolsWithoutPrimary.map((pool, index) => (
          <GridItem key={index} area={indexAreaHash[index + 1]}>
            <FeaturedPoolCard pool={pool} chain={pool.chain} isSmall />
          </GridItem>
        ))}
      </Grid>
    </VStack>
  )
}
