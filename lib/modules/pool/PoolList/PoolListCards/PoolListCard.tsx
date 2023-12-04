import { Card, HStack, VStack, Text, Box, Grid, GridItem } from '@chakra-ui/react'
import { PoolListItem, poolTypeHash } from '../../pool.types'
import { getNetworkConfig } from '@/lib/config/app.config'
import Image from 'next/image'
import { toPercentageFormatted } from '@/lib/shared/utils/numbers'
import { TokenIcon } from '@/lib/modules/tokens/TokenIcon'

interface Props {
  pool: PoolListItem
  cardClickHandler?: (event: React.MouseEvent<HTMLElement>, pool: PoolListItem) => void
  cardMouseEnterHandler?: (event: React.MouseEvent<HTMLElement>, pool: PoolListItem) => void
}

function PoolTokens({ pool }: { pool: PoolListItem }) {
  if (pool) {
    const displayTokens = pool.displayTokens
    return (
      <HStack spacing="1" wrap="wrap">
        {displayTokens.map((token, idx) => {
          return (
            <HStack key={token.address}>
              <Text fontWeight="bold" fontSize="1rem">
                {token.nestedTokens ? token.name : token.symbol}
                {token.weight && ` ${toPercentageFormatted(token.weight || '')}`}
                {idx <= displayTokens.length - 2 && ' / '}
              </Text>
            </HStack>
          )
        })}
      </HStack>
    )
  }
}

export function PoolListCard({ pool, cardClickHandler, cardMouseEnterHandler }: Props) {
  const networkConfig = getNetworkConfig(pool.chain)

  return (
    // TODO: added height for now to get a scrollbar
    <Card
      h="400"
      variant="gradient"
      onClick={event => cardClickHandler && cardClickHandler(event, pool)}
      cursor={cardClickHandler ? 'pointer' : 'default'}
      onMouseEnter={event => cardMouseEnterHandler && cardMouseEnterHandler(event, pool)}
    >
      <VStack alignItems="flex-start" py="4" px="3" h="full">
        <HStack alignItems="flex-start">
          <Image
            src={networkConfig.iconPath}
            width="45"
            height="45"
            alt={networkConfig.shortName}
            style={{ borderRadius: '100%', backgroundColor: 'white', padding: '2px' }}
          />
          <VStack alignItems="flex-start" gap="0" w="full">
            <Text fontWeight="medium" variant="secondary" fontSize="0.85rem">
              {poolTypeHash[pool.type]}
            </Text>
            <PoolTokens pool={pool} />
          </VStack>
        </HStack>
        <HStack py="6">
          {pool.displayTokens.map((token, idx) => (
            <Box key={token.address} ml={idx > 0 ? -5 : 0} zIndex={9999 - idx}>
              <TokenIcon
                chain={pool.chain}
                address={token.address}
                size={64}
                alt={token?.symbol || token.address}
                border="2px solid black"
              />
            </Box>
          ))}
        </HStack>
        <Grid w="full" h="full" templateColumns="1fr 1fr" gap="4">
          <GridItem>
            <Card h="full" variant="gradient">
              TEXT
            </Card>
          </GridItem>
          <GridItem>
            <Card h="full" variant="gradient">
              TEXT
            </Card>
          </GridItem>
          <GridItem>
            <Card h="full" variant="gradient">
              TEXT
            </Card>
          </GridItem>
          <GridItem>
            <Card h="full" variant="gradient">
              TEXT
            </Card>
          </GridItem>
        </Grid>
      </VStack>
    </Card>
  )
}
