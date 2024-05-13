'use client'

import { Grid, GridItem, Skeleton, Stack } from '@chakra-ui/react'
import { PoolAttributes } from './PoolAttributes/PoolAttributes'
import { PoolContracts } from './PoolContracts/PoolContracts'
import { PoolRisks } from './PoolRisks/PoolRisks'

export function PoolDetailAttributesRisksContracts({ isLoading = false }: { isLoading?: boolean }) {
  return (
    <Stack w="full">
      <Grid
        w="full"
        rowGap="md"
        columnGap="md"
        templateColumns={{ base: '1fr', md: 'repeat(2,1fr)' }}
        templateRows={{ base: undefined, md: 'repeat(2,1fr)' }}
        templateAreas={{
          base: `"attributes"
                 "risks"
                 "contracts"`,
          lg: `"attributes risks"
               "attributes contracts"`,
        }}
      >
        <GridItem area="attributes">
          {isLoading ? <Skeleton h="385px" w="full" /> : <PoolAttributes />}
        </GridItem>
        <GridItem area="risks">
          {isLoading ? <Skeleton h="200px" w="full" /> : <PoolRisks />}
        </GridItem>
        <GridItem area="contracts">
          {isLoading ? <Skeleton h="100px" w="full" /> : <PoolContracts />}
        </GridItem>
      </Grid>
    </Stack>
  )
}
