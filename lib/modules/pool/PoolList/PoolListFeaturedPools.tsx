import { Card, Grid, GridItem, Heading, VStack } from '@chakra-ui/react'

interface FeaturedPools {
  id: string
  imageUrl: string
  primary?: boolean
}

const featuredPools: FeaturedPools[] = [
  {
    id: '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014',
    imageUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    primary: true,
  },
  {
    id: '0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112',
    imageUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  },
  {
    id: '0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd0000000000000000000005c2',
    imageUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  },
  {
    id: '0x42ed016f826165c2e5976fe5bc3df540c5ad0af700000000000000000000058b',
    imageUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  },
  {
    id: '0x1ee442b5326009bb18f2f472d3e0061513d1a0ff000200000000000000000464',
    imageUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  },
]

const indexAreaHash: { [key: number]: string } = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
}

interface FeaturedPoolCardProps {
  pool: FeaturedPools
}

function FeaturedPoolCard({ pool }: FeaturedPoolCardProps) {
  return (
    <Card variant="gradient" h="full" w="full">
      {pool.id.slice(0, 8)}
    </Card>
  )
}

export function PoolListFeaturedPools() {
  const poolsWithoutPrimary = featuredPools.filter(pool => !pool.primary)
  const primaryPool = featuredPools.find(pool => pool.primary)

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
                Featured pools on<br></br> Balancer protocol
              </Heading>
              <FeaturedPoolCard pool={primaryPool} />
            </VStack>
          )}
        </GridItem>
        {poolsWithoutPrimary.map((pool, index) => (
          <GridItem key={index} area={indexAreaHash[index + 1]}>
            <FeaturedPoolCard pool={pool} />
          </GridItem>
        ))}
      </Grid>
    </VStack>
  )
}
