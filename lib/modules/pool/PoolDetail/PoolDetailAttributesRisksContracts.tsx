'use client'

import { Grid, GridItem, Stack } from '@chakra-ui/react'
import { PoolAttributes } from './PoolAttributes/PoolAttributes'
import { PoolContracts } from './PoolContracts/PoolContracts'
import { PoolRisks } from './PoolRisks/PoolRisks'

export function PoolDetailAttributesRisksContracts() {
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
          <PoolAttributes />
        </GridItem>
        <GridItem area="risks">
          <PoolRisks />
        </GridItem>
        <GridItem area="contracts">
          <PoolContracts />
        </GridItem>
      </Grid>
    </Stack>
  )
}
