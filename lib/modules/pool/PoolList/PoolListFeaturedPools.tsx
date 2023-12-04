import { Card, Center, Grid, GridItem, HStack, Heading, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'

interface FeaturedPools {
  id: string
  chain: string
  imageUrl: string
  primary?: boolean
}

const featuredPools: FeaturedPools[] = [
  {
    id: '0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112',
    chain: 'MAINNET',
    imageUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    primary: true,
  },
  {
    id: '0x32df62dc3aed2cd6224193052ce665dc181658410002000000000000000003bd',
    chain: 'ARBITRUM',
    imageUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  },
  {
    id: '0x4683e340a8049261057d5ab1b29c8d840e75695e00020000000000000000005a',
    chain: 'GNOSIS',
    imageUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  },
  {
    id: '0x42ed016f826165c2e5976fe5bc3df540c5ad0af700000000000000000000058b',
    chain: 'MAINNET',
    imageUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
  },
  {
    id: '0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd0000000000000000000005c2',
    chain: 'MAINNET',
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
      <VStack justifyContent="space-between" h="full">
        <HStack justifyContent="space-between" w="full">
          <Text>pool type</Text>
          <Text>TVL</Text>
        </HStack>
        <Image src={pool.imageUrl} width="24" height="24" alt="pool name" />
        <Center>
          <VStack>
            <Text>Pool Name</Text>
            <Text>APR</Text>
          </VStack>
        </Center>
      </VStack>
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
