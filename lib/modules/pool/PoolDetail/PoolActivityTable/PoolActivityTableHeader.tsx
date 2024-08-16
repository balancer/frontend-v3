'use client'

import { Grid, GridItem, Text } from '@chakra-ui/react'

export function PoolActivityTableHeader({ ...rest }) {
  return (
    <Grid {...rest} p={['ms', 'md']} w="full" borderBottom="1px solid" borderColor="border.base">
      <GridItem>
        <Text fontWeight="bold">User</Text>
      </GridItem>
      <GridItem>
        <Text fontWeight="bold">Action</Text>
      </GridItem>
      <GridItem>
        <Text fontWeight="bold">Transaction Details</Text>
      </GridItem>
      <GridItem textAlign="right">
        <Text fontWeight="bold">Value</Text>
      </GridItem>
      <GridItem textAlign="right">
        <Text fontWeight="bold">Time</Text>
      </GridItem>
    </Grid>
  )
}
