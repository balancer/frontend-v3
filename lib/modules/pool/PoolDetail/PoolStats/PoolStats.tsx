'use client'

import { Button, Grid, GridItem, Stack } from '@chakra-ui/react'
import { PoolCharts } from './PoolCharts/PoolCharts'
import PoolMetaBadges from '../PoolMetaBadges/PoolMetaBadges'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { PoolSnapshot } from './PoolSnapshot/PoolSnapshot'

export function PoolStats() {
  const pathname = usePathname()

  return (
    <Grid
      h="full"
      w="full"
      rowGap="md"
      columnGap="md"
      templateColumns={{ base: '1fr', md: 'repeat(4,1fr)' }}
      templateAreas={{
        base: `"meta-badges"
               "stats"
               "chart"`,
        lg: `"meta-badges meta-badges meta-badges meta-badges"
             "stats chart chart chart"`,
      }}
    >
      <GridItem area="meta-badges">
        <Stack direction={{ base: 'column-reverse', md: 'row' }}>
          <PoolMetaBadges />
          <Button
            as={Link}
            href={`${pathname}/add-liquidity`}
            variant="primary"
            prefetch={true}
            ml="auto"
          >
            Add liquidity
          </Button>
        </Stack>
      </GridItem>
      <GridItem area="stats">
        <PoolSnapshot />
      </GridItem>
      <GridItem area="chart">
        <PoolCharts />
      </GridItem>
    </Grid>
  )
}
