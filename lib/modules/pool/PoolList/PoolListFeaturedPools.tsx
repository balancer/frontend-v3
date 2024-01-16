import { Card, Center, Grid, GridItem, HStack, Heading, Text, VStack } from '@chakra-ui/react'
import { usePoolListFeaturedPools } from './usePoolListFeaturedPools'
import { GqlChain, GqlPoolUnion } from '@/lib/shared/services/api/generated/graphql'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { getAprLabel, getPoolPath, getPoolTypeLabel } from '../pool.utils'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'
import PoolWeightChart from '../PoolDetail/PoolWeightCharts/PoolWeightChart'
import { useRouter } from 'next/navigation'

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

  const cardClickHandler = (event: React.MouseEvent<HTMLElement>, pool: GqlPoolUnion) => {
    const poolPath = getPoolPath({ id: pool.id, chain: pool.chain })

    if (event.ctrlKey || event.metaKey) {
      window.open(poolPath, '_blank')
    } else {
      router.push(poolPath)
    }
  }

  // Prefetch pool page on card hover, otherwise there is a significant delay
  // between clicking the card and the pool page loading.
  const cardMouseEnterHandler = (event: React.MouseEvent<HTMLElement>, pool: GqlPoolUnion) => {
    const poolPath = getPoolPath({ id: pool.id, chain: pool.chain })
    router.prefetch(poolPath)
  }

  return (
    <Card
      variant="gradient"
      h="full"
      w="full"
      p="4"
      cursor="pointer"
      onClick={event => cardClickHandler(event, pool)}
      onMouseEnter={event => cardMouseEnterHandler(event, pool)}
    >
      <VStack justifyContent="space-between" h="full">
        <HStack justifyContent="space-between" w="full">
          <Text>{getPoolTypeLabel(pool.type)}</Text>
          <Text>{toCurrency(pool.dynamicData.totalLiquidity)} TVL</Text>
        </HStack>
        <PoolWeightChart pool={pool} chain={chain} hasLegend={hasLegend} isSmall={isSmall} />
        <Center>
          <VStack>
            <Text>{pool.name}</Text>
            <Text>{getAprLabel(pool.dynamicData.apr.apr)} APR</Text>
          </VStack>
        </Center>
      </VStack>
    </Card>
  )
}

export function PoolListFeaturedPools() {
  const { featuredPools: allFeaturedPools } = usePoolListFeaturedPools()
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
        h="600px"
        gap="4"
        alignContent="stretch"
        templateColumns={{
          base: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)', // align with PoolListCards
        }}
        templateAreas={{
          base: `"primary primary"
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
