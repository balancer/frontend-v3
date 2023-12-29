import { Card, Center, Grid, GridItem, HStack, Heading, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import { usePoolListFeaturedPools } from './usePoolListFeaturedPools'
import {
  GqlPoolFeaturedPoolGroup,
  GqlPoolMinimal,
} from '@/lib/shared/services/api/generated/graphql'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { getAprLabel, getPoolTypeLabel } from '../pool.utils'
import { useCurrency } from '@/lib/shared/hooks/useCurrency'

const indexAreaHash: { [key: number]: string } = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
}

interface FeaturedPoolCardProps {
  pool: GqlPoolFeaturedPoolGroup
}

function FeaturedPoolCard({ pool }: FeaturedPoolCardProps) {
  const { toCurrency } = useCurrency()
  const poolItem = pool.items.find(item => item.__typename === 'GqlPoolMinimal') as GqlPoolMinimal

  return (
    <Card variant="gradient" h="full" w="full" p="4">
      <VStack justifyContent="space-between" h="full">
        <HStack justifyContent="space-between" w="full">
          <Text>{getPoolTypeLabel(poolItem.type)}</Text>
          <Text>{toCurrency(poolItem.dynamicData.totalLiquidity)} TVL</Text>
        </HStack>
        <Image src={pool.icon} width="24" height="24" alt="pool name" />
        <Center>
          <VStack>
            <Text>{poolItem.name}</Text>
            <Text>{getAprLabel(poolItem.dynamicData.apr.apr)} APR</Text>
          </VStack>
        </Center>
      </VStack>
    </Card>
  )
}

export function PoolListFeaturedPools() {
  const { featuredPools } = usePoolListFeaturedPools()
  const { projectName } = getProjectConfig()

  const primaryPool = featuredPools.find(pool => pool.primary)
  const poolsWithoutPrimary = featuredPools.filter(pool => !pool.primary)

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
              <FeaturedPoolCard pool={primaryPool as GqlPoolFeaturedPoolGroup} />
            </VStack>
          )}
        </GridItem>
        {poolsWithoutPrimary.map((pool, index) => (
          <GridItem key={index} area={indexAreaHash[index + 1]}>
            <FeaturedPoolCard pool={pool as GqlPoolFeaturedPoolGroup} />
          </GridItem>
        ))}
      </Grid>
    </VStack>
  )
}
